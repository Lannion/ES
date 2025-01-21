import React, { useRef, forwardRef, useImperativeHandle } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const PDFGenerator = forwardRef(
  ({ children, excludeIds = [], excludeClasses = [] }, ref) => {
    const contentRef = useRef();

    useImperativeHandle(ref, () => ({
      downloadAndPrintPDF: (shouldDownload = true, slicePage = false) => {
        const input = contentRef.current;

        // Temporarily hide excluded elements
        const excludedElements = [];
        excludeIds.forEach((id) => {
          const element = document.getElementById(id);
          if (element) {
            excludedElements.push({
              element,
              originalDisplay: element.style.display,
            });
            element.style.display = "none";
          }
        });

        excludeClasses.forEach((className) => {
          const elements = document.getElementsByClassName(className);
          Array.from(elements).forEach((element) => {
            excludedElements.push({
              element,
              originalDisplay: element.style.display,
            });
            element.style.display = "none";
          });
        });

        // Generate PDF
        html2canvas(input, { scale: 3 }).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("p", "mm", "a4");
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

          const pageHeight = pdf.internal.pageSize.height;

          if (slicePage) {
            // If slicePage is true, add pages for content overflow
            let yOffset = 0;
            let pageCount = Math.ceil(pdfHeight / pageHeight);
            for (let i = 0; i < pageCount; i++) {
              if (i > 0) pdf.addPage();
              pdf.addImage(imgData, "PNG", 0, -yOffset, pdfWidth, pdfHeight);
              yOffset = pageHeight * (i + 1);
            }
          } else {
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            // Calculate scale to fit the content on one page
            const scale = Math.min(
              pdfWidth / canvasWidth,
              pdfHeight / canvasHeight
            );
            const scaledWidth = canvasWidth * scale;
            const scaledHeight = canvasHeight * scale;

            // Calculate margins for centering the content
            const marginX = (pdfWidth - scaledWidth) / 2;
            const marginY = (pdfHeight - scaledHeight) / 2;
            // If slicePage is false, fit everything onto one page
            pdf.addImage(imgData, "PNG", marginX, marginY, scaledWidth, scaledHeight);
          }

          // Conditional download
          if (shouldDownload) {
            pdf.save("Generated_Content.pdf");
          }

          // Print the PDF
          const pdfBlob = pdf.output("blob");
          const pdfURL = URL.createObjectURL(pdfBlob);
          const printWindow = window.open("", "_blank");
          if (printWindow) {
            const iframe = document.createElement("iframe");
            iframe.style.width = "100%";
            iframe.style.height = "100%";
            iframe.src = pdfURL;

            iframe.onload = () => {
              iframe.contentWindow?.print();
            };

            printWindow.document.body.appendChild(iframe);
          }
        });

        // Restore excluded elements
        excludedElements.forEach(({ element, originalDisplay }) => {
          element.style.display = originalDisplay;
        });
      },
    }));

    return (
      <div>
        {/* Content Wrapper */}
        <div ref={contentRef} className="mb-6">
          {children}
        </div>
      </div>
    );
  }
);

export default PDFGenerator;
