import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import User from '../../model/User';
import './List.scss';

function List({users, onOpenDeleteModal, isSignedIn}: {
  users: User[],
  onOpenDeleteModal: Function,
  isSignedIn: boolean
}) {
  return (
    <section className="card shadow">
      <div className="card-header">
        <div className="row">
          <div className="col">
            <h2 className="h2">Contacts list</h2>
          </div>
          <div className="col text-end">
            { isSignedIn && <Link to="/add" className="btn btn-primary">Add new contact</Link> }
          </div>
        </div>
      </div>
      <div className="card-body overflow-scroll">
        { users.length ?
          <div className="container">
            <div className="row">
              { users?.map((user: User) => (
                <div className="col-3" key={user.id}>
                  <div className="card mb-4">
                    <img className="card-img-top" src={ user.picture } alt=""/>
                    <div className="card-body">
                      <h3 className="card-title">{ user.name }</h3>
                      <dl className="card-text">
                        <dt>Phone:</dt>
                        <dd>{ user.contact }</dd>
                        <dt>E-mail address:</dt>
                        <dd>{ user.email }</dd>
                      </dl>
                      <Link to="/view" state={{ user }} className="btn btn-primary me-1 mb-1">More</Link>
                      { isSignedIn && <Link to="/edit" state={{ user }} className="btn btn-warning me-1 mb-1">Edit</Link> }
                      { isSignedIn && <button type="button"
                              className="btn btn-danger me-1 mb-1"
                              onClick={() => {
                                onOpenDeleteModal(user)
                              }}>Delete</button> }
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          : 
          <p>No contacts available. Please add new contact.</p>
        }
      </div>
    </section>
  );
}

export default List;
