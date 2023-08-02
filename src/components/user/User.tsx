import React, { ChangeEvent, useState } from 'react';
import { Link, Location, useLocation, NavigateFunction, useNavigate } from 'react-router-dom'
import User from '../../model/User';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const isFullNameValid = (fullName: string): boolean => (/^[A-Za-z\s]+$/).test(fullName) && fullName.length >= 5

const isContactValid = (contact: string): boolean => (/^\d+$/).test(contact) && contact.length === 9

const isEmailValid = (email: string): boolean => {
  return (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/).test(email);
}

const isEmailInUse = (email: string, users: User[]): boolean => users.find((user) => user.email === email) !== undefined;
const isContactInUse = (contact: string, users: User[]): boolean => users.find((user) => user.contact === contact) !== undefined;

function Form({ mode, onAddNew, onEdit }: {
  mode: 'edit' | 'add' | 'view',
  onAddNew?: Function,
  onEdit?: Function
}) {
  let navigate: NavigateFunction = useNavigate();
  let initialState = {
    name: '',
    email: '',
    id: 0,
    contact: '',
    picture: '',
    isSubmitted: false,
    isNameValid: false,
    isEmailValid: false,
    isEmailInUse: false,
    isContactValid: false,
    isContactInUse: false
  };
  const [value, setValue] = useState(initialState);
  const [contactsData] = useLocalStorage('contactsData', []);
  const location: Location = useLocation()
  const user: User | null = location?.state?.user;

  if (mode === 'edit' && !user) {
    navigate('/');
    return <></>;
  }

  if (mode === 'edit' ||
      mode === 'view') {
    initialState.email = user.email;
    initialState.id = user.id;
    initialState.name = user.name;
    initialState.contact = user.contact;
    initialState.picture = user.picture;
  }


  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const fileReader: FileReader = new FileReader();

    if (!event.target.files) {
      return;
    }

    fileReader.onloadend = function() {
      setValue({
        ...value,
        picture: String(fileReader.result)
      });
    }
    fileReader.readAsDataURL(event.target.files[0]);
  };

  const handleSubmit = (event: { preventDefault: () => void; }): void => {
    event.preventDefault();

    const isNameValid = isFullNameValid(value.name);
    const isEmailAddressValid = isEmailValid(value.email);
    const isEmailAlreadyRegistered = isEmailInUse(value.email, contactsData);
    const isContactAlreadyRegistered = isContactInUse(value.email, contactsData);
    const user: User = {
      name: value.name,
      email: value.email,
      id: value.id,
      contact: value.contact,
      picture: value.picture
    };

    setValue({
      ...value,
      isSubmitted: true,
      isNameValid,
      isEmailValid: isEmailAddressValid,
      isEmailInUse: isEmailAlreadyRegistered,
      isContactInUse: isContactAlreadyRegistered
    });

    if (!isEmailAddressValid || !isNameValid || isEmailAlreadyRegistered || !value.picture || isContactAlreadyRegistered) {
      return;
    }

    if (mode === 'edit') {
      onEdit(user);
    } else {
      onAddNew(user);
    }
  }

  const readOnly = mode === 'view';

  return (
    <section className="card shadow">
      <div className="card-header">
        <div className="row">
          <h2 className="h2">Form</h2>
        </div>
      </div>
      <div className="card-body">
        <form className="p-5">
          <div className="row mb-3">
            <div className="col-2 text-end">
              <label htmlFor="userName" className="form-labell pt-2">Name</label>
            </div>
            <div className="col-10">
              <input className={`form-control ${value.isSubmitted && !value.isNameValid ? 'is-invalid' : ''} ${mode === 'view' ? 'form-control-plaintext' : ''}`}
                     readOnly={readOnly}
                     id="userName"
                     value={value.name}
                     onBlur={(val) => {
                      setValue({
                        ...value,
                        isNameValid: isFullNameValid(val.target.value)
                      })
                     }}
                     onChange={(val) => {
                      setValue({
                        ...value,
                        name: val.target.value
                      })
                     }} />
              { value.isSubmitted && !value.isNameValid &&
                <p className="invalid-feedback">Please enter a valid name.</p>
              }
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-2 text-end">
              <label htmlFor="contact" className="form-label pt-2">Contact</label>
            </div>
            <div className="col-10">
              <input className={`form-control ${value.isSubmitted && (!value.isContactValid || value.isContactInUse) ? 'is-invalid' : ''} ${mode === 'view' ? 'form-control-plaintext' : ''}`}
                     readOnly={readOnly}
                     id="contact"
                     value={value.contact}
                     onBlur={(val) => {
                      setValue({
                        ...value,
                        isContactValid: isContactValid(val.target.value),
                        isContactInUse: isContactInUse(val.target.value, contactsData)
                      })
                     }}
                     onChange={(val) => {
                      setValue({
                        ...value,
                        contact: val.target.value
                      })
                     }} />
              { value.isSubmitted && !value.isContactValid &&
                <p className="invalid-feedback">Please enter a valid contact number (9 digits).</p>
              }
              { value.isSubmitted && value.isContactInUse &&
                <p className="invalid-feedback">Contact number already in use.</p>
              }
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-2 text-end">
              <label htmlFor="userEmail" className="form-label pt-2">E-mail</label>
            </div>
            <div className="col-10">
              <input type="email"
                     readOnly={readOnly}
                     className={`form-control ${value.isSubmitted && (!value.isEmailValid || value.isEmailInUse ) ? 'is-invalid' : ''} ${mode === 'view' ? 'form-control-plaintext' : ''}`}
                     id="userEmail"
                     value={value.email}
                     onBlur={(val) => {
                      setValue({
                        ...value,
                        isEmailValid: isEmailValid(val.target.value),
                        isEmailInUse: isEmailInUse(val.target.value, contactsData)
                      })
                     }}
                     onChange={(val) => {
                      setValue({
                        ...value,
                        email: val.target.value
                      })
                     }} />

              { value.isSubmitted && !value.isEmailValid &&
                <p className="invalid-feedback">Please enter a valid e-mail address.</p>
              }
              { value.isSubmitted && value.isEmailInUse &&
                <p className="invalid-feedback">E-mail address is already in use.</p>
              }
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-2 text-end">
              <label htmlFor="picture" className="form-label pt-1">Picture</label>
            </div>
            <div className="col-10">
              {!readOnly && <input className={`form-control-file mb-2 ${value.isSubmitted && !value.picture ? 'is-invalid' : ''}`}
                     type="file"
                     onChange={handleFileChange}
                     accept=".jpg, .jpeg, .png" /> }
              { value.picture ? <img src={`${value.picture}`} className="mw-100" /> : null}
              { value.isSubmitted && !value.picture &&
                <p className="invalid-feedback">Picture is mandatory.</p>
              }
            </div>
          </div>
          { mode !== 'view' &&
            <div className="row">
              <div className="col text-end">
                <Link to="/" className="btn btn-outline-danger">Cancel</Link>
                <button type="submit" className="btn btn-success ms-2" onClick={ handleSubmit }>Submit</button>
              </div>
            </div>
          }
        </form>
      </div>
    </section>
  );
}

export default Form;
