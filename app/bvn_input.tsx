import { create } from 'zustand';

interface NigeriaSignUpState {
  userNigeriaData: {
    firstname: string;
    lastname: string;
    bvn: string;
    dob: string;
    phone: string;
    email: string;
    country: string; // <--- ADD THIS LINE
  };
  setUserData: (data: Partial<NigeriaSignUpState['userNigeriaData']>) => void;
}

const useNigeriaSignUp = create<NigeriaSignUpState>((set) => ({
  userNigeriaData: {
    firstname: "",
    lastname: "",
    bvn: "",
    dob: "",
    phone: "",
    email: "",
    country: "", // <--- INITIALIZE THIS
  },

  setUserData: (data) => 
    set((state) => ({
      userNigeriaData: { ...state.userNigeriaData, ...data }
    })),
}));

export default useNigeriaSignUp;
