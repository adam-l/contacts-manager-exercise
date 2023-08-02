import React, { useEffect, useState } from 'react';
import { useNavigate, NavigateFunction, Routes, Route } from 'react-router-dom';
import Delete from './components/delete/Delete';
import List from './components/list/List';
import Form from './components/user/User';
import User from './model/User';
import { useLocalStorage } from './hooks/useLocalStorage';

const getAvailableID = (users: User[]): number => {
  let availableID: number = 0;

  for (let i: number = 0; i < users.length; i += 1) {
    const currentIdIsTaken: User | null = users.find((user: User) => user.id === i + 1);
    const nextIdIsTaken: User | null = users.find((user: User) => user.id === users[i].id + 1);

    if (!currentIdIsTaken) {
      availableID = i + 1;
      break;
    }

    if (!nextIdIsTaken) {
      availableID = users[i].id + 1;
      break;
    }
  };

  return availableID;
}

function App() {
  const [value, setData] = useState({
    isDeleteModalOpen: false,
    isSignedIn: false,
    userSignedIn: '',
    userToBeDeleted: {
      name: '',
      id: null,
      email: '',
      picture: '',
      contact: ''
    }
  });

  const [contactsData, setContactsData] = useLocalStorage('contactsData', []);
  const navigate: NavigateFunction = useNavigate();
  const addNewUser = (user: User): void => {
    setContactsData([
      ...contactsData,
      {
        id: getAvailableID(contactsData),
        name: user.name,
        contact: user.contact,
        picture: user.picture,
        email: user.email
      }
    ])
    navigate('/');
  }
  const editUser = (user: User): void => {
    setContactsData(contactsData.map((currentUser: User) => currentUser.id === user.id ? user : currentUser));
    navigate('/');
  }
  const deleteUser = (userToBeDeleted: User): void => {
    const users: User[] = contactsData.filter((user: User) => user.id !== userToBeDeleted.id);
    setData({
      ...value,
      isDeleteModalOpen: false,
      userToBeDeleted: {
        name: '',
        id: null,
        email: '',
        picture: '',
        contact: ''
      }
    });
    setContactsData(users)
  }
  const onHideDeleteModal = (): void => {
    setData({
      ...value,
      isDeleteModalOpen: false,
      userToBeDeleted: {
        name: '',
        id: null,
        email: '',
        picture: '',
        contact: ''
      }
    });
  }
  const onOpenDeleteModal = (userToBeDeleted: User): void => {
    setData({
      ...value,
      isDeleteModalOpen: true,
      userToBeDeleted
    });
  }
  const signIn = (event: { preventDefault: () => void; }): void => {
    event.preventDefault();
    const username = prompt('Enter username:');
    prompt('Enter password:');
    setData({
      ...value,
      isSignedIn: true,
      userSignedIn: username
    });
  }
  const signOut = (event: { preventDefault: () => void; }): void => {
    event.preventDefault();
    setData({
      ...value,
      isSignedIn: false,
      userSignedIn: ''
    });
  } 

  return (
    <>
      <div className="container mx-auto mt-5 mb-5">
        { !value.isSignedIn ? 
          <a href="#"
             className="link-primary float-end mt-3"
             onClick={ signIn }>Sign-in</a> :
          <div className="float-end clearfix">
            <p className="mb-0">Signed-in as <span className="fst-italic">{value.userSignedIn}. </span></p>
            <p className="mt-0 text-end mb-1">
              <a href="#"
                className="link-primary"
                onClick={ signOut }>Sign-out</a>.
            </p>
          </div>

        }
        <h1 className="mb-4 clearfix">Dashboard</h1>
        <Routes>
          <Route path="/" element={
            <List isSignedIn={value.isSignedIn}
                  users={contactsData}
                  onOpenDeleteModal={onOpenDeleteModal} />
          }/>
          <Route path="/view" element={<Form mode="view" />} />
          <Route path="/edit" element={<Form mode="edit" onEdit={editUser} />} />
          <Route path="/add" element={<Form mode="add" onAddNew={addNewUser} />} />
        </Routes>
      </div>
      { value.isDeleteModalOpen &&
        <Delete onDelete={ deleteUser }
                user={ value.userToBeDeleted }
                onHideDeleteModal={ onHideDeleteModal } />
      }
    </>
  );
}

export default App;
