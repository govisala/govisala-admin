import axios from "axios";
import { useEffect, useState } from "react";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [imgModal, setImgModal] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch all users from the API
  const fetchUsers = () => {
    axios
      .get("http://localhost:3210/admin/users")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
      });
  };

  // Handle status change (verify/pending)
  const handleStatusChange = (userId, newStatus) => {
    axios
      .post("http://localhost:3210/admin/verify-user", {
        user_id: userId,
        status: newStatus,
      })
      .then(() => {
        setUsers(
          users.map((user) =>
            user.user_id === userId ? { ...user, user_status: newStatus } : user
          )
        );
      })
      .catch((err) => {
        console.error("Error updating user status:", err);
      });
  };

  // Handle user deletion
  const handleDelete = (userId) => {
    axios
      .delete(`http://localhost:3210/admin/delete-user/${userId}`)
      .then((res) => {
        console.log(res.data);

        setUsers(users.filter((user) => user.user_id !== userId));
      })
      .catch((err) => {
        console.error("Error deleting user:", err.response.data.message);
      });
  };

  // Open edit modal with user data
  const handleEdit = (user) => {
    setEditUser({ ...user });
    setShowModal(true);
  };

  // Save edited user data
  const handleSave = () => {
    console.log(editUser);

    if (editUser) {
      axios
        .put("http://localhost:3210/admin/edit-user", editUser)
        .then((res) => {
          console.log(res.data);

          setUsers(
            users.map((user) =>
              user.user_id === editUser.user_id ? editUser : user
            )
          );
          setShowModal(false);
        })
        .catch((err) => {
          console.error("Error saving user data:", err.response.data.message);
        });
    }
  };

  // View user ID/BR image
  const handleViewImage = (imgUrl) => {
    setImgUrl("http://localhost:3210/" + imgUrl);
    setImgModal(true);
  };

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user_mail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
      <div className="mt-6 bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Users</h2>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Joined
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  View ID/BR
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No users found.
                  </td>
                </tr>
              )}
              {filteredUsers.map((user) => (
                <tr key={user.user_id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.user_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.user_mail}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.user_role}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.user_createdAt?.split("T")[0]}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      onClick={() => handleViewImage(user.user_docs)}
                      className="text-sm cursor-pointer text-white bg-green-400 hover:bg-green-600 rounded-full px-2 py-1 text-center"
                    >
                      View {">"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.user_status === "verified"
                          ? "bg-green-100 text-green-800"
                          : user.user_status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.user_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-green-600 hover:text-green-900 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        handleStatusChange(
                          user.user_id,
                          user.user_status === "verified"
                            ? "pending"
                            : "verified"
                        )
                      }
                      className="text-blue-600 hover:text-blue-900 mr-2"
                    >
                      {user.user_status === "verified" ? "Unverify" : "Verify"}
                    </button>
                    <button
                      onClick={() => handleDelete(user.user_id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Image Modal */}
      {imgModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                User ID or Business Registration
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <img
                src={imgUrl}
                alt="User ID"
                className="w-full h-auto rounded-lg"
              />
            </div>
            <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
              <button
                type="button"
                onClick={() => setImgModal(false)}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showModal && editUser && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Edit User</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={editUser.user_name || ""}
                    onChange={(e) =>
                      setEditUser({ ...editUser, user_name: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={editUser.user_mail || ""}
                    onChange={(e) =>
                      setEditUser({ ...editUser, user_mail: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Role
                  </label>
                  <select
                    id="role"
                    value={editUser.user_role || ""}
                    onChange={(e) =>
                      setEditUser({ ...editUser, user_role: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  >
                    <option value="Farmer">Farmer</option>
                    <option value="Buyer">Buyer</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    value={editUser.user_status || ""}
                    onChange={(e) =>
                      setEditUser({ ...editUser, user_status: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  >
                    <option value="verified">Verified</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
              <button
                type="button"
                onClick={handleSave}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
