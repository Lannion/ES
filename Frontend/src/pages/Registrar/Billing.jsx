import React, { useState, useEffect } from "react";
import RegistrarSidebar from "./RegistrarSidebar";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import useData from "../../components/DataUtil";
import { useAlert } from "../../components/Alert";

const Billing = ({ onLogout }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [receivedMoney, setReceivedMoney] = useState(0);
  const [applyFreeTuition, setApplyFreeTuition] = useState(true);
  const [change, setChange] = useState("P 0.00"); // Initialize `change` with a default value
  const navigate = useNavigate();
  const location = useLocation();

  const { student, courses, billings } = location.state || {}; // Default billings to an empty array
  const { data, error, createData } = useData("/api/batch/");

  const [totalFees, setTotalFees] = useState(0);
  // const totalAmount = 8290.0;
  const amountNeeded = applyFreeTuition ? totalFees : totalFees;
  const { triggerAlert } = useAlert();

  const { studentId } = useParams();

  useEffect(() => {
    if (!studentId)
      navigate(`/registrar/enroll-student/${student.id}`, {
        state: { student: student },
      });
  }, [studentId]);

  // Dynamically calculate `change` when `receivedMoney` or `applyFreeTuition` changes
  useEffect(() => {
    const numericMoney = parseFloat(receivedMoney) || 0; // Ensure receivedMoney is a valid number
    const calculatedChange = applyFreeTuition
      ? 0 // No change when CHED is applied
      : Math.max(0, amountNeeded - numericMoney);

    setChange(`P ${calculatedChange.toFixed(2)}`); // Update `change`
  }, [receivedMoney, applyFreeTuition]);

  const labFess = billings.filter(
    (item) => item.billing?.category === "LAB_FEES"
  );
  const otherFess = billings.filter(
    (item) => item.billing?.category === "OTHER_FEES"
  );
  const assessmentFees = billings.filter(
    (item) => item.billing?.category === "ASSESSMENT"
  );

  const handleConfirmPayment = async () => {
    try {
      const payload = {
        student_id: student?.id,
        course_ids: courses || [],
        voucher: applyFreeTuition,
        paid: parseFloat(receivedMoney) || 0, // Ensure valid numeric data
      };

      await createData(payload);
    } catch (err) {
      console.error("Error in payment confirmation:", err);
      alert("An unexpected error occurred. Please contact support.");
    }
  };

  useEffect(() => {
    const labFeesTotal = parseFloat(
      (
        labFess?.reduce((sum, fee) => sum + (parseFloat(fee.price) || 0), 0) ||
        0
      ).toFixed(2)
    );
    const otherFeesTotal = parseFloat(
      (
        otherFess?.reduce(
          (sum, fee) => sum + (parseFloat(fee.price) || 0),
          0
        ) || 0
      ).toFixed(2)
    );
    const assessmentFeesTotal = parseFloat(
      (
        assessmentFees?.reduce(
          (sum, fee) => sum + (parseFloat(fee.price) || 0),
          0
        ) || 0
      ).toFixed(2)
    );

    const totalFee = parseFloat(
      (labFeesTotal + otherFeesTotal + assessmentFeesTotal || 0).toFixed(2)
    );

    setTotalFees(totalFee);

    if (data?.success) {
      triggerAlert("success", "Success", "Student enrolled successfully.");
      // navigate("/registrar/evaluate-payment", { state: { totalAmount, receivedMoney, change } });
      navigate(`/registrar/certificate-of-registration/${student.id}`);
    }
    if (error) {
      console.log(error?.data);

      // Check if errors array exists and has content
      if (error?.data?.error?.errors) {
        // Loop through each error in the errors array
        for (const errorDetail of error.data.error.errors) {
          // Log each error's message
          console.log(errorDetail?.error);

          // Optionally trigger an alert for each error message
          triggerAlert(
            "error",
            "Error",
            errorDetail?.error || "Unknown error occurred."
          );
        }
      }

      // Fallback for general error message
      triggerAlert(
        "error",
        "Error",
        error?.data?.error?.message || "Error enrolling this student."
      );
    }
  }, [data, error]);

  const handleBack = () => {
    navigate(`/registrar/enroll-student/${student.id}`, {
      state: { student: student },
    });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#e4ecfa] to-[#fefae0]">
      <RegistrarSidebar
        onLogout={onLogout}
        currentPage="billing"
        isCollapsed={isSidebarCollapsed}
        onToggleSidebar={setIsSidebarCollapsed}
      />

      <div
        className={`flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? "ml-[0rem]" : "ml-[0rem]"
        } w-full p-6 sm:px-6 lg:px-8`}
      >
        <div className="w-full max-w-full lg:max-w-[87.5rem] mx-auto">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center lg:text-left">BILLING</h1>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <div className="bg-white shadow-lg rounded-[1.875rem] p-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  Lab Fees
                </h2>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 px-6">
                  {labFess.map((fees, index) => (
                    <React.Fragment key={index}>
                      <p>{fees?.billing?.name}</p>
                      <p className="text-right">P{fees?.price || 0.0}</p>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="bg-white shadow-lg rounded-[1.875rem] p-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  Other Fees
                </h2>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 px-6">
                  {otherFess.map((fees, index) => (
                    <React.Fragment key={index}>
                      <p>{fees?.billing?.name}</p>
                      <p className="text-right">P{fees?.price || 0.0}</p>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="bg-white shadow-lg rounded-[1.875rem] p-6 mt-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  Payment
                </h2>
                <div className="space-y-4">
                  {!applyFreeTuition && (
                    <div className="flex items-center">
                      <label className="w-1/3 text-sm text-gray-600 font-bold">
                        Received Money:
                      </label>
                      <input
                        type="number"
                        value={receivedMoney}
                        onChange={(e) => setReceivedMoney(e.target.value)}
                        className="border rounded-lg w-full p-2 text-sm focus:ring-2 focus:ring-blue-500"
                        placeholder="Input received money..."
                      />
                    </div>
                  )}
                  <div className="flex flex-col items-start gap-2">
                    <div className="grid grid-cols-1 text-sm text-gray-600">
                      <p className="w-auto text-sm text-gray-600 font-bold">
                        Amount Needed to Pay:
                      </p>
                      <p className="text-sm text-gray-600 ml-[1rem]">
                        P {amountNeeded.toFixed(2)}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 text-sm text-gray-600">
                      <p className="w-auto text-sm text-gray-600 font-bold">
                        Change:
                      </p>
                      <p className="text-sm text-gray-600 ml-[1rem]">
                        {change}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      id="chedFreeTuition"
                      checked={applyFreeTuition}
                      onChange={() => setApplyFreeTuition(!applyFreeTuition)}
                    />
                    <label
                      htmlFor="chedFreeTuition"
                      className="ml-2 text-sm text-gray-600"
                    >
                      Apply CHED Free Tuition and Misc. Free
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-8 sm:col-span-4 space-y-6">
              <div className="bg-white shadow-lg rounded-[1.875rem] p-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  Assessment
                </h2>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 px-14">
                  {assessmentFees.map((fees, index) => (
                    <React.Fragment key={index}>
                      <p>{fees?.billing?.name}</p>
                      <p className="text-right">P{fees?.price || 0.0}</p>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="bg-white shadow-lg rounded-[1.875rem] p-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  Summary
                </h2>
                <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 text-center">
                  <div className="flex flex-col items-center">
                    <p>Total Units</p>
                    <p>{21}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p>Total Hours</p>
                    <p>{31}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p>Total Amount</p>
                    <p>{totalFees.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  className="bg-gray-300 text-gray-700 px-6 py-2 shadow-lg rounded-[1.875rem] hover:bg-gray-400"
                  onClick={() => handleBack()}
                >
                  Back to Course
                </button>
                <button
                  className="bg-blue-600 text-white px-6 py-2 shadow-lg rounded-[1.875rem] hover:bg-blue-700"
                  onClick={handleConfirmPayment}
                >
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
