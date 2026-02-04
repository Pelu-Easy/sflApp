import { router } from 'expo-router';
import { create } from 'zustand';

interface SignUpStore {
    isSignUpActive: boolean;
    startSignUp: () => void;
    completeSignUp: () => void;
}

const useSignUpStore = create<SignUpStore>((set) => ({
    isSignUpActive: false,

    // Called when starting the process
    startSignUp: () => {
        set({ isSignUpActive: true });
        // Use an absolute path to ensure it always lands on the right screen
        router.push('/bvn_validation' as any); 
    },

    // Called when the user finishes or cancels
    completeSignUp: () => set({ isSignUpActive: false }),
}));

export default useSignUpStore;


// import { router } from 'expo-router';
// import { create } from 'zustand';

// interface SignUpStore {
//     isSignUpActive: boolean;
//     startSignUp: () => void;
//     completeSignUp: () => void;
// }

// const useSignUpStore = create<SignUpStore>((set) => ({
//     isSignUpActive: false,

//     // Called when starting the process
//     startSignUp: () => {
//         set({ isSignUpActive: true });
//         // Use an absolute path to ensure it always lands on the right screen
//         router.push('/bvn_validation' as any); 
//     },

//     // Called when the user finishes or cancels
//     completeSignUp: () => set({ isSignUpActive: false }),
// }));

// export default useSignUpStore;