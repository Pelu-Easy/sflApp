import { create } from 'zustand';

// This Interface tells VS Code exactly what is inside your store
interface UserState {
  userData: {
    fname: string;
    lname: string;
    email: string;
    phone_no: string;
    selectedCountry: string;
    password?: string;
  };
  setUserData: (
    fname: string, 
    lname: string, 
    email: string, 
    phone_no: string, 
    selectedCountry: string, 
    password?: string
  ) => void;
}

const useUserSignUp = create<UserState>((set) => ({
  userData: {
    fname: "",
    lname: "",
    email: "",
    phone_no: "",
    selectedCountry: "",
    password: "",
  },

  setUserData: (fname, lname, email, phone_no, selectedCountry, password) => (
    set({ userData: { fname, lname, email, phone_no, selectedCountry, password } })
  )
}));

export default useUserSignUp;