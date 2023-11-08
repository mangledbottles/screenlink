// import React, { createContext, useState, useContext } from 'react';

// // Define the shape of your context state
// interface ScreenRecorderContextState {
//     sources: any[];
//     selectedSource: any;
//     setSources: React.Dispatch<React.SetStateAction<any[]>>;
//     setSelectedSource: React.Dispatch<React.SetStateAction<any>>;
// }

// const defaultState: ScreenRecorderContextState = {
//     sources: [],
//     selectedSource: null,
//     setSources: () => { },
//     setSelectedSource: () => { },
// };

// // Create the context
// const ScreenContext = createContext<ScreenRecorderContextState>(defaultState);

// // Create a custom hook for using the context
// export const useScreenRecorder = (): ScreenRecorderContextState => {
//     const context = useContext(ScreenContext);
//     if (!context) {
//         throw new Error('useScreenRecorder must be used within a ScreenRecorderProvider');
//     }
//     return context;
// };

// // Create a provider component
// export const ScreenRecorderProvider = ({ children }: { children: React.ReactNode }) => {
//     const [sources, setSources] = useState<any[]>([]);
//     const [selectedSource, setSelectedSource] = useState<any>(null);

//     // @ts-ignore
//     return (
//         <ScreenContext.Provider
//             value={{
//                 sources,
//                 selectedSource,
//                 setSources,
//                 setSelectedSource,
//             }}
//         >
//             {children}
//         </ScreenContext.Provider>
//     );
// };