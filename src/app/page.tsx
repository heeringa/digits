'use client';

import React, { useState } from 'react';
//import styles from './styles.module.css';


export default function Page() {
  const [text, setText] = useState(Array(6).fill(''));
  const [focus, setFocus] = useState(Array(6).fill(false));

  const handleChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const newText = [...text];
    newText[index] = event.target.value;
    setText(newText);
  };

  const handleFocus = (index: number) => {
    const newFocus = [...focus];
    newFocus[index] = true;
    setFocus(newFocus);
  };

  const handleBlur = (index: number) => {
    const newFocus = [...focus];
    newFocus[index] = false;
    setFocus(newFocus);
  };

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-2 gap-4 justify-items-center">
        {text.map((t, index) => (
          <div 
            key={index} 
            className="flex items-center justify-center border-2 border-gray-700 bg-gray-200 rounded-full h-24 w-24 relative"
          >
            <input 
              type="text" 
              value={t} 
              placeholder=" " 
              onChange={(event) => handleChange(index, event)} 
              onFocus={() => handleFocus(index)}
              onBlur={() => handleBlur(index)}
              className="w-full text-center border-none bg-transparent px-4 py-2"
            />
            <label 
              className={`absolute left-1/2 transform -translate-x-1/2 transition-all duration-100 ${
                t || focus[index] ? 'top-[-30px] text-gray-400 text-xs' : 'top-[-20px]'
              }`}
            >
              Enter number
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}


// export default function Page() {
//   const [text, setText] = useState(Array(6).fill(''));

//   const handleChange = (index, event) => {
//     const newText = [...text];
//     newText[index] = event.target.value;
//     setText(newText);
//   };

//   return (
//     <div className="container mx-auto">
//       <div className="grid grid-cols-2 gap-4 justify-items-center">
//         {text.map((t, index) => (
//           <div 
//             key={index} 
//             className="flex items-center justify-center border-2 border-gray-700 bg-gray-200 rounded-full h-24 w-24 relative"
//           >
//             <input 
//               type="text" 
//               value={t} 
//               placeholder=" " 
//               onChange={(event) => handleChange(index, event)} 
//               className="w-full text-center border-none bg-transparent px-4 py-2"
//             />
//             <label className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 transition-all duration-100">Enter number</label>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


// export default function Page() {
//   const [text, setText] = useState(Array(6).fill(''));

//   const handleChange = (index, event) => {
//     const newText = [...text];
//     newText[index] = event.target.value;
//     setText(newText);
//   };

//   return (
//     <div className={styles.container}>
//       <div className={styles.grid}>
//         {text.map((t, index) => (
//           <div key={index} className={styles.circle}>
//             <input 
//               type="text" 
//               value={t} 
//               placeholder=" "
//               onChange={(event) => handleChange(index, event)} 
//             />
//             <label className={styles.label}>Enter number</label>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


