import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import universityLogo from "../../images/universityLogo.svg";
import RegistrarSidebar from "./RegistrarSidebar";
import useData from "../../components/DataUtil";
import { useNavigate, useParams } from "react-router-dom";
import PDFGenerator from "../../components/PDFGenerator";

const CertificateOfRegistration = ({ onLogout }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [corData, setCorData] = useState(null);
  const navigate = useNavigate();
  const { studentId } = useParams();

  const { data, error, getData } = useData(`/api/cor/?id=${studentId}`);
  const pdfGeneratorRef = useRef();

  useLayoutEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!studentId) navigate("/registrar/enrollmentList");
  }, [studentId, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      await getData();
    };
    fetchData();
  }, [getData]);

  useEffect(() => {
    if (data) {
      setCorData(data);
    } else if (error) {
      console.error(error);
    }
  }, [data, error]);

  if (!corData) {
    return <div>Loading...</div>;
  }

  const labFees = corData.acad_term_billings.filter(
    (billing) => billing.billing_list.category === "LAB_FEES"
  );

  const otherFees = corData.acad_term_billings.filter(
    (billing) => billing.billing_list.category === "OTHER_FEES"
  );

  const assessment = corData.acad_term_billings.filter(
    (billing) => billing.billing_list.category === "ASSESSMENT"
  );

  const handleDownloadAndPrint = () => {
    if (pdfGeneratorRef.current) {
      // Safely access the function
      pdfGeneratorRef.current.downloadAndPrintPDF(false, false); // false means ready to print but not saving the pdf
    } else {
      console.error("PDFGenerator ref is not set!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="flex min-h-screen bg-gradient-to-b from-[#e4ecfa] to-[#fefae0]">
        <RegistrarSidebar
          onLogout={onLogout}
          currentPage="certificate"
          isCollapsed={isSidebarCollapsed}
          onToggleSidebar={setIsSidebarCollapsed}
          className={isMobile ? "sidebar-collapsed" : ""}
        />

        <div
          className={`flex flex-col items-center flex-1 transition-all duration-300 ${
            isMobile
              ? "ml-[12rem]"
              : "ml-[15.625rem] md:ml-[20rem] lg:ml-[0rem]"
          } py-[2rem] px-[1rem] md:px-[2rem] lg:px-[4rem]`}
        >
          <div className="w-[57rem] max-w-[57rem]">
            <div className="text-center mb-8">
              <h1 className="text-[36px] font-extrabold text-[#000000] uppercase tracking-wide">
                Certificate of Registration
              </h1>
            </div>
            <PDFGenerator
              ref={pdfGeneratorRef}
              excludeIds={["printPDFButton"]}
              downloadAndPrintPDF={() => {}}
            >
              <div className="flex justify-center items-center">
                <div className="bg-white w-full rounded-[20px] shadow-lg p-8">
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

                  <div className="grid grid-cols-2 gap-x-24 gap-y-6 mb-6 text-[14px]">
                    <div>
                      <div className="flex">
                        <p className="font-bold w-1/3">Student Number:</p>
                        <p className="ml-4">{corData.student.id}</p>
                      </div>
                      <div className="flex">
                        <p className="font-bold w-1/3">Student Name:</p>
                        <p className="ml-4">
                          {`${corData.student.last_name}, ${corData.student.first_name} ${corData.student.middle_name}`}
                        </p>
                      </div>
                      <div className="flex">
                        <p className="font-bold w-1/3">Course:</p>
                        <p className="ml-4">{corData.student.program}</p>
                      </div>
                      <div className="flex">
                        <p className="font-bold w-1/3">Year:</p>
                        <p className="ml-4">{corData.student.year_level}</p>
                      </div>
                      <div className="flex">
                        <p className="font-bold w-1/3">Address:</p>
                        <p className="ml-4">{`${
                          corData.student.address.street || ""
                        } ${corData.student.address.barangay || ""} ${
                          corData.student.address.city
                        }, ${corData.student.address.province}`}</p>
                      </div>
                    </div>
                    <div className="ml-20">
                      <div className="flex">
                        <p className="font-bold w-1/3">Semester:</p>
                        <p className="ml-4">{corData.student.semester}</p>
                      </div>
                      <div className="flex">
                        <p className="font-bold w-1/3">Date:</p>
                        <p className="ml-4">
                          {new Date(
                            corData.enrollments[0].date
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex">
                        <p className="font-bold w-1/3">Section:</p>
                        <p className="ml-4">
                          {`${corData.student.program} ${
                            corData.student.year_level
                          }-${corData.student.section || "TBA"}`}
                        </p>
                      </div>
                      <div className="flex">
                        <p className="font-bold w-1/3">School Year:</p>
                        <p className="ml-4">{corData.student.academic_year}</p>
                      </div>
                    </div>
                  </div>
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
                        {corData.enrollments.length > 0
                          ? corData.enrollments.map((enrollment, index) => (
                              <tr key={index}>
                                <td className="border p-2">
                                  {enrollment.course?.code}
                                </td>
                                <td className="border p-2">
                                  {enrollment.course?.title}
                                </td>
                                <td className="border p-2">
                                  {enrollment.course?.units || 0}
                                </td>
                                <td className="border p-2">
                                  {enrollment.schedule?.time || "N/A"}
                                </td>
                                <td className="border p-2">
                                  {enrollment.schedule?.day || "N/A"}
                                </td>
                                <td className="border p-2">
                                  {enrollment.schedule?.room || "N/A"}
                                </td>
                              </tr>
                            ))
                          : [...Array(5)].map((_, index) => (
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
                              <div key={index} className="flex justify-between">
                                {lab.billing_list.name || "-"}
                                <span>{lab.billing_list.price || "-"}</span>
                              </div>
                            ))}
                            {labFees.length === 0 && (
                              <div
                                className="border p-2 text-center"
                                colSpan="6"
                              >
                                No billings available.
                              </div>
                            )}
                          </td>
                          <td
                            className="border pb-5 pr-5 pl-5 align-top"
                            rowSpan={10}
                          >
                            {otherFees.map((other, index) => (
                              <div key={index} className="flex justify-between">
                                {other.billing_list.name || "-"}
                                <span>{other.billing_list.price || "-"}</span>
                              </div>
                            ))}
                            {otherFees.length === 0 && (
                              <div
                                className="border p-2 text-center"
                                colSpan="6"
                              >
                                No billings available.
                              </div>
                            )}
                          </td>
                          <td
                            className="border pb-5 pr-5 pl-5 align-top"
                            rowSpan={10}
                          >
                            {assessment.map((assess, index) => (
                              <div key={index} className="flex justify-between">
                                {assess.billing_list.name || "-"}
                                <span>{assess.billing_list.price || "-"}</span>
                              </div>
                            ))}
                            {assessment.length === 0 && (
                              <div
                                className="border p-2 text-center"
                                colSpan="6"
                              >
                                No billings available.
                              </div>
                            )}
                          </td>
                        </tr>
                        <table className="w-full border-black border-collapse">
                          <tbody>
                            <tr className="border">
                              <td className="pb-2 pr-5 pl-5 flex justify-between">
                                Total Units:<span>{corData?.total_units}</span>
                              </td>
                            </tr>
                            <tr className="border">
                              <td className="pb-2 pr-5 pl-5 flex justify-between">
                                Total Hours:<span>{corData?.total_hours}</span>
                              </td>
                            </tr>
                            <tr className="border">
                              <td className="pb-2 pr-5 pl-5 flex justify-between">
                                Total Amount:
                                <span>
                                  {corData?.total_acad_term_billing_price}
                                </span>
                              </td>
                              <td className="pb-2 pr-5 pl-5 flex flex-col justify-between items-center">
                                <span className="self-start">Scholarship:</span>
                                <span className="text-center">
                                  {corData?.scholarship || "-"}
                                </span>
                              </td>
                            </tr>
                            <tr className="border">
                              <td className="pb-2 pr-5 pl-5 flex justify-between">
                                Tuition:
                                <span>
                                  {
                                    assessment.find(
                                      (item) =>
                                        item.billing_list.name === "Tuition Fee"
                                    ).billing_list.price
                                  }
                                </span>
                              </td>
                              <td className="pb-2 pr-5 pl-5 flex justify-between">
                                SFDF:
                                <span>
                                  {assessment.find(
                                    (item) => item.billing_list.name === "SFDF"
                                  ).billing_list.price || "-"}
                                </span>
                              </td>
                              <td className="pb-2 pr-5 pl-5 flex justify-between">
                                SRF:
                                <span>
                                  {assessment.find(
                                    (item) => item.billing_list.name === "SRF"
                                  ).billing_list.price || "-"}
                                </span>
                              </td>
                            </tr>
                            <tr className="border">
                              <td className="pb-2 pr-5 pl-5 flex justify-between">
                                Terms of Payment
                              </td>
                              {corData.terms_payment.map((terms, index) => (
                                <td
                                  key={index}
                                  className="pb-2 pr-5 pl-5 flex justify-between"
                                >
                                  {terms?.term}:<span>{terms?.amount}</span>
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </tbody>
                    </table>
                  </div>

                  <div>
                    <h3 className="font-bold text-left mb-4">
                      Additional Information
                    </h3>
                    <div className="text-sm">
                      <div className="flex justify-start mb-2">
                        <p className="font-bold mr-2 w-1/6">Old/New Student:</p>
                        <p className="ml-2">{corData.student.category}</p>
                      </div>
                      <div className="flex justify-start mb-2">
                        <p className="font-bold mr-2 w-1/6">
                          Registration Status:
                        </p>
                        <p className="ml-2">{corData.student.status}</p>
                      </div>
                      <div className="flex justify-start mb-2">
                        <p className="font-bold mr-2 w-1/6">Date of Birth:</p>
                        <p className="ml-2">{corData.student.date_of_birth}</p>
                      </div>
                      <div className="flex justify-start mb-2">
                        <p className="font-bold mr-2 w-1/6">Gender:</p>
                        <p className="ml-2">{corData.student.gender}</p>
                      </div>
                      <div className="flex justify-start mb-2">
                        <p className="font-bold mr-2 w-1/6">Contact Number:</p>
                        <p className="ml-2">{corData.student.contact_number}</p>
                      </div>
                      <div className="flex justify-start mb-2">
                        <p className="font-bold mr-2 w-1/6">Email Address:</p>
                        <p className="ml-2">{corData.student.email}</p>
                      </div>
                    </div>

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
            </PDFGenerator>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateOfRegistration;
