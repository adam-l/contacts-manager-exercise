import React from 'react';
import User from './../../model/User';

function Delete({user, onDelete, onHideDeleteModal}: {
  user: User,
  onDelete: Function,
  onHideDeleteModal: Function
}) {
  return (
    <>
      <section className="modal fade show d-block">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Delete</h3>
              <button type="button"
                      className="btn-close"
                      aria-label="Close"
                      onClick={() => onHideDeleteModal() }></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete: { user.name }?</p>
            </div>
            <div className="modal-footer">
              <button type="button"
                      className="btn btn-secondary"
                      onClick={() => onHideDeleteModal() }>Cancel</button>
              <button type="button"
                      className="btn btn-danger"
                      onClick={() => {
                        onDelete(user)
                      }}>Delete</button>
            </div>
          </div>
        </div>
      </section>
      <div className="modal-backdrop fade show"></div>
    </>
  );
}

export default Delete;
