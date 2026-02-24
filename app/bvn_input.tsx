import { create } from 'zustand';

interface NigeriaSignUpState {
  userNigeriaData: {
    firstname: string;
    lastname: string;
    bvn: string;
    dob: string;
    phone: string;
    email: string;
    country: string;
  };
  setUserData: (data: Partial<NigeriaSignUpState['userNigeriaData']>) => void;
  clearUserData: () => void;
}

const useNigeriaSignUp = create<NigeriaSignUpState>((set) => ({
  userNigeriaData: {
    firstname: "",
    lastname: "",
    bvn: "",
    dob: "",
    phone: "",
    email: "",
    country: "",
  },

  setUserData: (data) => 
    set((state) => ({
      userNigeriaData: { ...state.userNigeriaData, ...data }
    })),

  // THIS FUNCTION RESET APP STATE
  clearUserData: () => set({
    userNigeriaData: {
      firstname: "",
      lastname: "",
      bvn: "",
      dob: "",
      phone: "",
      email: "",
      country: "",
    }
  }),
}));

export default useNigeriaSignUp;