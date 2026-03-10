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
  fetchUserProfile: (token: string) => Promise<void>;
  savePushToken: (token: string, userToken: string) => Promise<void>;
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
      console.log("FULL API RAW RESULT:", JSON.stringify(result, null, 2));

      if (response.ok) {
        const source = Array.isArray(result.data) 
          ? result.data[0] 
          : (result.data || result.user || result);

        if (source) {
          set((state) => ({
            userNigeriaData: {
              ...state.userNigeriaData,
              firstname: source.firstName || source.firstname || source.first_name || state.userNigeriaData.firstname,
              lastname: source.lastName || source.lastname || source.last_name || state.userNigeriaData.lastname,
              email: source.email || state.userNigeriaData.email,
              phone: source.phoneNumber || source.phone || source.phone_number || state.userNigeriaData.phone,
            }
          }));
        }
      } else {
        console.log("API Error Status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }

    // TEMPORARY TEST DATA
    if (token) {
       set((state) => ({
         userNigeriaData: {
           ...state.userNigeriaData,
           firstname: "Israel", 
           lastname: "Adigun"
         }
       }));
    }
  },

  savePushToken: async (token: string, userToken: string) => {
    try {
      await fetch('https://inv-backend-1.onrender.com/api/account/v1/save-token', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ push_token: token }),
      });
      console.log("Token saved to backend");
    } catch (e) {
      console.error("Failed to save push token", e);
    }
  },
}));

export default useNigeriaSignUp;