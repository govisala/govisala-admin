// components/PaymentManagement.jsx
import { useState } from "react";

function PaymentManagement() {
  // In a real app, these would be fetched from an API
  const [payments, setPayments] = useState([
    {
      id: 1,
      from: "Jane Smith",
      to: "John Doe",
      amount: "$126.00",
      fee: "$3.78",
      date: "2025-03-29",
      status: "Completed",
    },
    {
      id: 2,
      from: "Mike Johnson",
      to: "Sarah Williams",
      amount: "$89.50",
      fee: "$2.69",
      date: "2025-03-28",
      status: "Completed",
    },
    {
      id: 3,
      from: "David Brown",
      to: "Mike Johnson",
      amount: "$210.75",
      fee: "$6.32",
      date: "2025-03-28",
      status: "Pending",
    },
    {
      id: 4,
      from: "Sarah Williams",
      to: "David Brown",
      amount: "$45.00",
      fee: "$1.35",
      date: "2025-03-27",
      status: "Completed",
    },
    {
      id: 5,
      from: "John Doe",
      to: "Jane Smith",
      amount: "$150.00",
      fee: "$4.50",
      date: "2025-03-26",
      status: "Failed",
    },
  ]);

  const [selectedDate, setSelectedDate] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const calculateTotalFees = () => {
    return payments
      .filter((payment) => payment.status === "Completed")
      .reduce((total, payment) => {
        return total + parseFloat(payment.fee.replace("$", ""));
      }, 0)
      .toFixed(2);
  };

  const filterPayments = () => {
    return payments.filter((payment) => {
      const matchesStatus =
        selectedStatus === "All" || payment.status === selectedStatus;
      const matchesDate =
        selectedDate === "All" || payment.date === selectedDate;
      return matchesStatus && matchesDate;
    });
  };

  const uniqueDates = [
    "All",
    ...new Set(payments.map((payment) => payment.date)),
  ];

  return (
    <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900">
        Payment Management
      </h1>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <div className="w-6 h-6 text-white"></div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Transactions
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {payments.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <div className="w-6 h-6 text-white"></div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Fees Collected (3%)
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    ${calculateTotalFees()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <div className="w-6 h-6 text-white"></div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Completed Transactions
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {
                      payments.filter(
                        (payment) => payment.status === "Completed"
                      ).length
                    }
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h2 className="text-lg font-medium text-gray-900">
            Transaction History
          </h2>
          <div className="mt-3 sm:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              {uniqueDates.map((date) => (
                <option key={date} value={date}>
                  {date === "All" ? "All Dates" : date}
                </option>
              ))}
            </select>
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
                  From
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  To
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Fee (3%)
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
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filterPayments().map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{payment.from}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{payment.to}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {payment.amount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{payment.fee}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{payment.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        payment.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : payment.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PaymentManagement;
