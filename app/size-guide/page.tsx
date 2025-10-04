// "use client";

// import React from "react";
// import Modal from "./Modal";

// interface SizeGuideModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   productCategory?: string;
// }

// const clothingMeasurements: Record<string, Record<string, string>> = {
//   "Chest (inches)": {
//     XS: "32-34",
//     S: "34-36",
//     M: "36-38",
//     L: "38-40",
//     XL: "40-42",
//     XXL: "42-44",
//     XXXL: "44-46",
//   },
//   "Waist (inches)": {
//     XS: "28-30",
//     S: "30-32",
//     M: "32-34",
//     L: "34-36",
//     XL: "36-38",
//     XXL: "38-40",
//     XXXL: "40-42",
//   },
//   "Length (inches)": {
//     XS: "26-27",
//     S: "27-28",
//     M: "28-29",
//     L: "29-30",
//     XL: "30-31",
//     XXL: "31-32",
//     XXXL: "32-33",
//   },
// };

// const instructions = [
//   "Measure your chest at the fullest part, keeping the tape measure horizontal",
//   "Measure your waist at the narrowest part, usually just above the belly button",
//   "For length, measure from the top of the shoulder to the desired hemline",
//   "Take measurements while wearing light clothing for accuracy",
// ];


// export default function SizeGuideModal({
//   isOpen,
//   onClose,
// }: SizeGuideModalProps) {
//   const sizes = Object.keys(
//     clothingMeasurements[Object.keys(clothingMeasurements)[0]]
//   );

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
//       <div className="p-6">
//         {/* Header */}
//         <div className="mb-6">
//           <h2 className="text-2xl font-bold text-black mb-2">Size Guide</h2>
//           <p className="text-gray-600">
//             Find your perfect fit with our clothing size chart
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Size Chart Table */}
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold text-black">
//               Clothing Size Chart
//             </h3>

//             <div className="overflow-x-auto">
//               <table className="w-full border-collapse border border-black">
//                 <thead className="bg-black text-white">
//                   <tr>
//                     <th className="border border-black px-4 py-3 text-left font-semibold">
//                       Measurement
//                     </th>
//                     {sizes.map((size) => (
//                       <th
//                         key={size}
//                         className="border border-black px-3 py-3 text-center font-semibold min-w-[60px]"
//                       >
//                         {size}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {Object.entries(clothingMeasurements).map(
//                     ([measurement, sizeData]) => (
//                       <tr key={measurement} className="hover:bg-gray-50">
//                         <td className="border border-black px-4 py-3 font-medium text-black">
//                           {measurement}
//                         </td>
//                         {sizes.map((size) => (
//                           <td
//                             key={size}
//                             className="border border-black px-3 py-3 text-center text-black"
//                           >
//                             {sizeData[size] || "-"}
//                           </td>
//                         ))}
//                       </tr>
//                     )
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Instructions and Tips */}
//           <div className="space-y-6">
//             {/* How to Measure */}
//             <div>
//               <h3 className="text-lg font-semibold text-black mb-4">
//                 How to Measure
//               </h3>
//               <div className="space-y-3">
//                 {instructions.map((instruction, index) => (
//                   <div key={index} className="flex items-start gap-3">
//                     <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
//                       {index + 1}
//                     </div>
//                     <p className="text-gray-700 text-sm leading-relaxed">
//                       {instruction}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="mt-8 pt-6 border-t border-black flex justify-between items-center">
//           <p className="text-sm text-gray-600">
//             Need help? Contact our customer service team for personalized sizing
//             assistance.
//           </p>
//           <button
//             onClick={onClose}
//             className="px-6 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </Modal>
//   );
// }
import React from "react";

const clothingMeasurements: Record<string, Record<string, string>> = {
  "Chest (inches)": {
    XS: "32-34",
    S: "34-36",
    M: "36-38",
    L: "38-40",
    XL: "40-42",
    XXL: "42-44",
    XXXL: "44-46",
  },
  "Waist (inches)": {
    XS: "28-30",
    S: "30-32",
    M: "32-34",
    L: "34-36",
    XL: "36-38",
    XXL: "38-40",
    XXXL: "40-42",
  },
  "Length (inches)": {
    XS: "26-27",
    S: "27-28",
    M: "28-29",
    L: "29-30",
    XL: "30-31",
    XXL: "31-32",
    XXXL: "32-33",
  },
};

const instructions = [
  "Measure your chest at the fullest part, keeping the tape measure horizontal",
  "Measure your waist at the narrowest part, usually just above the belly button",
  "For length, measure from the top of the shoulder to the desired hemline",
  "Take measurements while wearing light clothing for accuracy",
];

export default function SizeGuidePage() {
  const sizes = Object.keys(
    clothingMeasurements[Object.keys(clothingMeasurements)[0]]
  );

  return (
    <div className="max-w-5xl mt-4 mx-auto px-6 py-16 {josefin.className}">
      {/* Header */}
      <div className="mb-10 text-center">
        {/* Page Title */}
      <div className="mt-20">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 ">
        Size Guide
      </h1>
      </div>
        <p className="text-gray-600">
          Find your perfect fit with our clothing size chart.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Size Chart Table */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-black">
            Clothing Size Chart
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-black">
              <thead className="bg-black text-white">
                <tr>
                  <th className="border border-black px-4 py-3 text-left font-semibold">
                    Measurement
                  </th>
                  {sizes.map((size) => (
                    <th
                      key={size}
                      className="border border-black px-3 py-3 text-center font-semibold min-w-[60px]"
                    >
                      {size}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(clothingMeasurements).map(
                  ([measurement, sizeData]) => (
                    <tr key={measurement} className="hover:bg-gray-50">
                      <td className="border border-black px-4 py-3 font-medium text-black">
                        {measurement}
                      </td>
                      {sizes.map((size) => (
                        <td
                          key={size}
                          className="border border-black px-3 py-3 text-center text-black"
                        >
                          {sizeData[size] || "-"}
                        </td>
                      ))}
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Instructions and Tips */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-black mb-4">
            How to Measure
          </h2>
          <div className="space-y-3">
            {instructions.map((instruction, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {instruction}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-12 pt-6 border-t border-black text-center">
        <p className="text-sm text-gray-600">
          Need help? Contact our customer service team for personalized sizing
          assistance.
        </p>
      </div>
    </div>
  );
}
