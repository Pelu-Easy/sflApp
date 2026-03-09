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
    token: string;
  };
  setUserData: (data: Partial<NigeriaSignUpState['userNigeriaData']>) => void;
  clearUserData: () => void;
  // NEW: Function to fetch profile from the provided API
  fetchUserProfile: (token: string) => Promise<void>;
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
    token: "",
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
      token: "",
    }
  }),

  // NEW: Logic to fetch and sync with the Render backend
  fetchUserProfile: async (token: string) => {
    try {
      const response = await fetch('https://inv-backend-1.onrender.com/api/account/v1/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok && result.data) {
        set((state) => ({
          userNigeriaData: {
            ...state.userNigeriaData,
            // Mapping API keys (firstName/lastName) to your store keys (firstname/lastname)
            firstname: result.data.firstName || state.userNigeriaData.firstname,
            lastname: result.data.lastName || state.userNigeriaData.lastname,
            email: result.data.email || state.userNigeriaData.email,
            phone: result.data.phoneNumber || state.userNigeriaData.phone,
          }
        }));
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  },
}));

export default useNigeriaSignUp;