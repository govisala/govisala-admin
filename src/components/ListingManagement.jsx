// components/ListingManagement.jsx
import { useState, useEffect } from "react";
import axios from "axios";

function ListingManagement() {
  const [sellerListings, setSellerListings] = useState([]);
  const [buyerRequests, setBuyerRequests] = useState([]);
  const [editListing, setEditListing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [activeTab, setActiveTab] = useState("sellerListings");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const sellerResponse = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}admin/seller-listings`
      );
      setSellerListings(sellerResponse.data);

      const buyerResponse = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}admin/buyer-requests`
      );
      setBuyerRequests(buyerResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      if (activeTab === "sellerListings") {
        await axios.put(
          `${import.meta.env.VITE_SERVER_URL}admin/update-listing-status/${id}`,
          {
            status: newStatus,
          }
        );
        setSellerListings(
          sellerListings.map((listing) =>
            listing.id === id ? { ...listing, status: newStatus } : listing
          )
        );
      } else {
        await axios.put(
          `${import.meta.env.VITE_SERVER_URL}admin/update-request-status/${id}`,
          {
            status: newStatus,
          }
        );
        setBuyerRequests(
          buyerRequests.map((request) =>
            request.id === id ? { ...request, status: newStatus } : request
          )
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      if (activeTab === "sellerListings") {
        await axios.delete(
          `${import.meta.env.VITE_SERVER_URL}admin/delete-listing/${id}`
        );
        setSellerListings(
          sellerListings.filter((listing) => listing.id !== id)
        );
      } else {
        await axios.delete(
          `${import.meta.env.VITE_SERVER_URL}admin/delete-request/${id}`
        );
        setBuyerRequests(buyerRequests.filter((request) => request.id !== id));
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleEdit = (item) => {
    setEditListing({ ...item });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (editListing) {
      try {
        if (activeTab === "sellerListings") {
          await axios.put(
            `${import.meta.env.VITE_SERVER_URL}admin/update-listing/${
              editListing.id
            }`,
            editListing
          );
          setSellerListings(
            sellerListings.map((listing) =>
              listing.id === editListing.id ? editListing : listing
            )
          );
        } else {
          await axios.put(
            `${import.meta.env.VITE_SERVER_URL}admin/update-request/${
              editListing.id
            }`,
            editListing
          );
          setBuyerRequests(
            buyerRequests.map((request) =>
              request.id === editListing.id ? editListing : request
            )
          );
        }
        setShowModal(false);
      } catch (error) {
        console.error("Error saving changes:", error);
      }
    }
  };

  const getFilteredItems = () => {
    const items =
      activeTab === "sellerListings" ? sellerListings : buyerRequests;

    // First filter by status
    const statusFiltered =
      filterStatus === "All"
        ? items
        : items.filter((item) => {
            if (activeTab === "sellerListings") {
              return item.status === filterStatus.toLowerCase();
            } else {
              // For buyer requests, "active" status corresponds to "Verified" in UI
              if (filterStatus === "Verified") return item.status === "active";
              return item.status === filterStatus.toLowerCase();
            }
          });

    // Then filter by search term
    return statusFiltered.filter((item) => {
      const searchFields =
        activeTab === "sellerListings"
          ? [item.item_name, item.location, item.area]
          : [item.item_name, item.location, item.area];

      return searchFields.some(
        (field) =>
          field && field.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  };

  const filteredItems = getFilteredItems();

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900">
        Listing Management
      </h1>

      <div className="mt-4 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("sellerListings")}
            className={`${
              activeTab === "sellerListings"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Seller Listings
          </button>
          <button
            onClick={() => setActiveTab("buyerRequests")}
            className={`${
              activeTab === "buyerRequests"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Buyer Requests
          </button>
        </nav>
      </div>

      <div className="mt-6 bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h2 className="text-lg font-medium text-gray-900">
            {activeTab === "sellerListings"
              ? "Seller Listings"
              : "Buyer Requests"}
          </h2>
          <div className="mt-3 sm:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Verified">Verified</option>
              <option value="Rejected">Rejected</option>
            </select>
            <input
              type="text"
              placeholder="Search listings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="text-center py-10">
              <p>Loading...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-10">
              <p>No items found.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Item Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Location
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {activeTab === "sellerListings" ? "Price" : "Bid Range"}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Quantity
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
                    Date
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
                {filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.item_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.location}, {item.area}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {activeTab === "sellerListings"
                          ? `Rs. ${item.unit_price}`
                          : `Rs. ${item.bid_from} - ${item.bid_to}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.quantity}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.status === "active" || item.status === "verified"
                            ? "bg-green-100 text-green-800"
                            : item.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.status === "active"
                          ? "Verified"
                          : item.status.charAt(0).toUpperCase() +
                            item.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {activeTab === "sellerListings"
                          ? formatDate(item.harvest_date)
                          : formatDate(item.required_date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-green-600 hover:text-green-900 mr-2"
                      >
                        Edit
                      </button>
                      {item.status === "pending" && (
                        <button
                          onClick={() =>
                            handleStatusChange(
                              item.id,
                              activeTab === "sellerListings"
                                ? "verified"
                                : "active"
                            )
                          }
                          className="text-blue-600 hover:text-blue-900 mr-2"
                        >
                          Verify
                        </button>
                      )}
                      {item.status === "pending" && (
                        <button
                          onClick={() =>
                            handleStatusChange(item.id, "rejected")
                          }
                          className="text-orange-600 hover:text-orange-900 mr-2"
                        >
                          Reject
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && editListing && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Edit {activeTab === "sellerListings" ? "Listing" : "Request"}
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-y-6">
                <div>
                  <label
                    htmlFor="item_name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Item Name
                  </label>
                  <input
                    type="text"
                    id="item_name"
                    value={editListing.item_name || ""}
                    onChange={(e) =>
                      setEditListing({
                        ...editListing,
                        item_name: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {activeTab === "sellerListings" ? "Price" : "Bid Range"}
                  </label>
                  {activeTab === "sellerListings" ? (
                    <input
                      type="text"
                      id="price"
                      value={editListing.unit_price || ""}
                      onChange={(e) =>
                        setEditListing({
                          ...editListing,
                          unit_price: e.target.value,
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                  ) : (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        id="bid_from"
                        placeholder="From"
                        value={editListing.bid_from || ""}
                        onChange={(e) =>
                          setEditListing({
                            ...editListing,
                            bid_from: e.target.value,
                          })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                      <input
                        type="text"
                        id="bid_to"
                        placeholder="To"
                        value={editListing.bid_to || ""}
                        onChange={(e) =>
                          setEditListing({
                            ...editListing,
                            bid_to: e.target.value,
                          })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="quantity"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Quantity
                  </label>
                  <input
                    type="text"
                    id="quantity"
                    value={editListing.quantity || ""}
                    onChange={(e) =>
                      setEditListing({
                        ...editListing,
                        quantity: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
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
                    value={editListing.status || ""}
                    onChange={(e) =>
                      setEditListing({ ...editListing, status: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option
                      value={
                        activeTab === "sellerListings" ? "verified" : "active"
                      }
                    >
                      Verified
                    </option>
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

export default ListingManagement;
