import { createContext } from "react";

export const  AppContext = createContext();

const AppContextProvider =(props) => {
    const calculateAge = (dob) => {
        const today  =  new Date();
        const birtDate = new Date(dob);
        let age = today.getFullYear() - birtDate.getFullYear();
        return age;
    }
     const month = [
    "oca",
    "Şub",
    "Mar",
    "Nis",
    "May",
    "Haz",
    "Tem",
    "Ağu",
    "Eyl",
    "Eki",
    "Kas",
    "Ara",
  ];
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("-");
    return (
      dateArray[0] +
      " " +
      month[parseInt(dateArray[1]) - 1] +
      " " +
      dateArray[2]
    );
  };

    const value = { calculateAge, slotDateFormat     }

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
export default AppContextProvider;