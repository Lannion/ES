import React, { useState, useEffect, useRef } from "react";
import Header from "./Header"; // Custom Header
import Sidebar from "./Sidebar"; // Custom Sidebar
import universityLogo from "../../images/universityLogo.svg";
import { useNavigate } from "react-router-dom";
import useData from "../../components/DataUtil";
import PDFGenerator from "../../components/PDFGenerator";

const COR = ({ onLogout }) => {
  const navigate = useNavigate();
  const pdfGeneratorRef = useRef();

  const year = "3rd Year"; // Replace with dynamic value if needed
  const section = "A"; // Replace with dynamic value if needed

  const [currentSection, setCurrentSection] = useState("cor");
  const { data, error, getData } = useData("/api/cor/");
  const [student, setStudent] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [billings, setBillings] = useState([]);
  const [total, setTotal] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    // Fetch student data on component mount
    const fetchData = async () => {
      await getData(); // Fetch data
    };
    fetchData();
  }, [getData]);

  useEffect(() => {
    // Update the `student` and `enrollments` state when `data` changes
    if (data) {
      if (data.student) {
        setStudent(data.student); // Set the student data
      }
      if (data.enrollments) {
        setEnrollments(data.enrollments); // Set the enrollments data
      }
      if (data.acad_term_billings) {
        setBillings(data.acad_term_billings);
      }
      if (data.total_acad_term_billing_price) {
        setTotal(data.total_acad_term_billing_price);
      }
    } else if (error) {
      setFetchError(error.response);
      console.log(fetchError);
    }
  }, [data, error, fetchError]);

  const handleNavigate = (section) => {
    setCurrentSection(section); // Update the current section
    switch (section) {
      case "dashboard":
        navigate("/student/dashboard");
        break;
      case "profile":
        navigate("/student/profile");
        break;
      case "cor":
        navigate("/student/cor");
        break;
      case "checklist":
        navigate("/student/checklist");
        break;
      default:
        break;
    }
  };

  const labFees = billings.filter(
    (billingData) => billingData.billing_list.category === "LAB_FEES"
  );

  const otherFees = billings.filter(
    (billingData) => billingData.billing_list.category === "OTHER_FEES"
  );

  const assessment = billings.filter(
    (billingData) => billingData.billing_list.category === "ASSESSMENT"
  );

  const handleDownloadAndPrint = () => {
    if (pdfGeneratorRef.current) {
      // Safely access the function
      pdfGeneratorRef.current.downloadAndPrintPDF(false); // false means ready to print but not saving the pdf
    } else {
      console.error("PDFGenerator ref is not set!");
    }
  };

  return (
    <div className="w-screen min-h-screen bg-gradient-to-b from-[#e4ecfa] to-[#fefae0] flex flex-col">
      {/* Header Section */}
      <Header onLogout={onLogout} />
      <div className="flex justify-center items-center">
        <div className="w-[57rem] max-w-[57rem]">
          <div className="flex justify-center items-center bg-[#e4ecfa] py-3">
            <h1 className="text-[36px] font-extrabold text-[#000000] uppercase tracking-wide mt-5 text-center w-full sm:w-auto">
              Certificate of Registration
            </h1>
          </div>

          {/* Main Content */}
          <PDFGenerator
            ref={pdfGeneratorRef}
            excludeIds={["printPDFButton"]}
            downloadAndPrintPDF={() => {}}
          >
            <div className="flex flex-1 justify-center items-center w-full h-auto mt-3 mb-[1rem]">
              <Sidebar
                onNavigate={handleNavigate}
                activeSection={currentSection}
              />

              {/* Main Content */}
              <div className="flex flex-1 justify-center items-center w-full mt-7 sm:mt-5 md:mt-7 mb-[7rem] sm:mb-5 px-4 sm:px-0">
                <div className="bg-white w-full max-w-4xl rounded-[20px] shadow-lg p-8 sm:p-6 xs:p-4">
                  {/* Header Section */}
                  <div className="text-center mb-6">
                    <img
                      src={universityLogo}
                      alt="University Logo"
                      className="h-16 mx-auto mb-4"
                    />
                    <h2 className="text-[20px] font-bold uppercase">
                      Cavite State University
                    </h2>
                    <p className="text-[16px] font-medium">Bacoor Campus</p>
                    <h3 className="text-[20px] font-bold mt-4">
                      Registration Form
                    </h3>
                  </div>

                  {/* Student Info Section */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 text-[14px]">
                    <div className="flex flex-col">
                      <div className="flex">
                        <p className="font-bold w-1/3">Student Number:</p>
                        <p className="ml-4">{student?.id}</p>
                      </div>

                      <div className="flex">
                        <p className="font-bold w-1/3">Student Name:</p>
                        <p className="ml-4">
                          {`${student?.last_name}, ${student?.first_name} ${student?.middle_name}`}
                        </p>
                      </div>

                      <div className="flex">
                        <p className="font-bold w-1/3">Course:</p>
                        <p className="ml-4">{student?.program}</p>
                      </div>

                      <div className="flex">
                        <p className="font-bold w-1/3">Year:</p>
                        <p className="ml-4">{student?.year_level}</p>
                      </div>

                      <div className="flex">
                        <p className="font-bold w-1/3">Address:</p>
                        <p className="ml-4">{`${
                          student?.address?.street || ""
                        } ${student?.address?.barangay || ""} ${
                          student?.address?.city
                        }, ${student?.address?.province} `}</p>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <div className="flex">
                        <p className="font-bold w-1/3">Semester:</p>
                        <p className="ml-4">{student?.semester}</p>
                      </div>
                      <div className="flex">
                        <p className="font-bold w-1/3">Date:</p>
                        <p className="ml-4">
                          {new Date(enrollments[0]?.date).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "numeric",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                      <div className="flex">
                        <p className="font-bold w-1/3">Section:</p>
                        <p className="ml-4">
                          {`${student?.program} ${student?.year_level}-${
                            student?.section || "TBA"
                          }`}
                        </p>
                      </div>
                      <div className="flex">
                        <p className="font-bold w-1/3">School Year:</p>
                        <p className="ml-4">{student?.academic_year}</p>
                      </div>
                    </div>
                  </div>

                  {/* Course Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse mb-6 text-[14px]">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="border p-2">COURSE CODE</th>
                          <th className="border p-2">COURSE TITLE</th>
                          <th className="border p-2">UNITS</th>
                          <th className="border p-2">TIME</th>
                          <th className="border p-2">DAY</th>
                          <th className="border p-2">ROOM</th>
                        </tr>
                      </thead>
                      <tbody>
                        {enrollments.length > 0
                          ? enrollments.map((enrollment, index) => (
                              <tr key={index}>
                                <td className="border p-2">
                                  {enrollment.course?.code || "N/A"}
                                </td>
                                <td className="border p-2">
                                  {enrollment.course?.title || "N/A"}
                                </td>
                                <td className="border p-2">
                                  {enrollment.course?.lab_units +
                                    enrollment.course?.lec_units || "N/A"}
                                </td>
                                <td className="border p-2">
                                  {enrollment.schedule?.time || "TBA"}
                                </td>
                                <td className="border p-2">
                                  {enrollment.schedule?.day || "TBA"}
                                </td>
                                <td className="border p-2">
                                  {enrollment.schedule?.room || "TBA"}
                                </td>
                              </tr>
                            ))
                          : // Placeholder rows when no data is available
                            [...Array(5)].map((_, index) => (
                              <tr key={index}>
                                <td className="border p-2">&nbsp;</td>
                                <td className="border p-2">&nbsp;</td>
                                <td className="border p-2">&nbsp;</td>
                                <td className="border p-2">&nbsp;</td>
                                <td className="border p-2">&nbsp;</td>
                                <td className="border p-2">&nbsp;</td>
                              </tr>
                            ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="overflow-x-auto mb-6">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="bg-gray-100 text-gray-700">
                          <th className="border p-3">Lab Fees</th>
                          <th className="border p-3">Other Fees</th>
                          <th className="border p-3">Assessment</th>
                          <th className="border p-3">Payments</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td
                            className="border pb-5 pr-5 pl-5 align-top"
                            rowSpan={10}
                          >
                            {labFees.map((lab, index) => (
                              <td key={index} className="flex justify-between">
                                {lab.billing_list.name || "-"}
                                <span>{lab.billing_list.price || "-"}</span>
                              </td>
                            ))}
                            {labFees.length === 0 && (
                              <td
                                className="border p-2 text-center"
                                colSpan="6"
                              >
                                No billings available.
                              </td>
                            )}
                          </td>
                          <td
                            className="border pb-5 pr-5 pl-5 align-top"
                            rowSpan={10}
                          >
                            {otherFees.map((other, index) => (
                              <td key={index} className="flex justify-between">
                                {other.billing_list.name || "-"}
                                <span>{other.billing_list.price || "-"}</span>
                              </td>
                            ))}
                            {otherFees.length === 0 && (
                              <td
                                className="border p-2 text-center"
                                colSpan="6"
                              >
                                No billings available.
                              </td>
                            )}
                          </td>
                          <td
                            className="border pb-5 pr-5 pl-5 align-top"
                            rowSpan={10}
                          >
                            {assessment.map((assess, index) => (
                              <td key={index} className="flex justify-between">
                                {assess.billing_list.name || "-"}
                                <span>{assess.billing_list.price || "-"}</span>
                              </td>
                            ))}
                            {assessment.length === 0 && (
                              <td
                                className="border p-2 text-center"
                                colSpan="6"
                              >
                                No billings available.
                              </td>
                            )}
                          </td>
                        </tr>
                        <table className="w-full border-black border-collapse">
                          <tbody>
                            <tr className="border">
                              <td className="pb-2 pr-5 pl-5 flex justify-between">
                                Total Units:<span>1</span>
                              </td>
                            </tr>
                            <tr className="border">
                              <td className="pb-2 pr-5 pl-5 flex justify-between">
                                Total Hours:<span>1</span>
                              </td>
                            </tr>
                            <tr className="border">
                              <td className="pb-2 pr-5 pl-5 flex justify-between">
                                Total Amount:<span>{total}</span>
                              </td>
                              <td className="pb-2 pr-5 pl-5 flex justify-between">
                                Scholarship:<span>1</span>
                              </td>
                            </tr>
                            <tr className="border">
                              <td className="pb-2 pr-5 pl-5 flex justify-between">
                                Tuition:<span>1</span>
                              </td>
                              <td className="pb-2 pr-5 pl-5 flex justify-between">
                                SFDF:<span>1</span>
                              </td>
                              <td className="pb-2 pr-5 pl-5 flex justify-between">
                                SRF:<span>1</span>
                              </td>
                            </tr>
                            <tr className="border">
                              <td className="pb-2 pr-5 pl-5 flex justify-between">
                                Terms of Payment
                              </td>
                              <td className="pb-2 pr-5 pl-5 flex justify-between">
                                First:<span>1</span>
                              </td>
                              <td className="pb-2 pr-5 pl-5 flex justify-between">
                                Second:<span>1</span>
                              </td>
                              <td className="pb-2 pr-5 pl-5 flex justify-between">
                                Third:<span>1</span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </tbody>
                    </table>
                  </div>

                  {/* Additional Student Information Section */}
                  <div>
                    <h3 className="font-bold text-left mb-4">
                      Additional Information
                    </h3>
                    <div className="text-sm">
                      <div className="flex justify-start mb-2">
                        <p className="font-bold mr-2 w-1/6">Old/New Student:</p>
                        <p className="ml-2">{student?.category}</p>
                      </div>
                      <div className="flex justify-start mb-2">
                        <p className="font-bold mr-2 w-1/6">
                          Registration Status:
                        </p>
                        <p className="ml-2">{student?.status}</p>
                      </div>
                      <div className="flex justify-start mb-2">
                        <p className="font-bold mr-2 w-1/6">Date of Birth:</p>
                        <p className="ml-2">{student?.date_of_birth}</p>
                      </div>
                      <div className="flex justify-start mb-2">
                        <p className="font-bold mr-2 w-1/6">Gender:</p>
                        <p className="ml-2">{student?.gender}</p>
                      </div>
                      <div className="flex justify-start mb-2">
                        <p className="font-bold mr-2 w-1/6">Contact Number:</p>
                        <p className="ml-2">{student?.contact_number}</p>
                      </div>
                      <div className="flex justify-start mb-2">
                        <p className="font-bold mr-2  w-1/6">Email Address:</p>
                        <p className="ml-2">{student?.email}</p>
                      </div>
                    </div>

                    {/* Student's Signature Section */}
                    <div className="mt-6">
                      <p className="font-bold mb-1">Student's Signature:</p>
                      <div className="border-t-2 border-black w-1/3 mx-40 sm:w-1/2 xs:w-full sm:mx-40 xs:mx-2"></div>
                    </div>
                  </div>

                  <div className="relative mt-6 h-20">
                    <button
                      id="printPDFButton"
                      className="bg-blue-500 text-white px-6 py-3 sm:px-4 sm:py-2 rounded hover:bg-blue-600 absolute bottom-4 right-4"
                      onClick={handleDownloadAndPrint}
                    >
                      Print PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </PDFGenerator>
        </div>
      </div>
    </div>
  );
};

export default COR;
