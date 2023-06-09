import { extendTheme } from "@chakra-ui/react";

const colors = {
  black: "#0e1315",
  gray: {
    50: "#f9fafa",
    100: "#f0f2f2",
    200: "#e5e8e9",
    300: "#d0d5d7",
    400: "#a6aeb2",
    500: "#748187",
    600: "#46575f",
    700: "#2a3940",
    800: "#182125",
    900: "#131b1e",
  },
  pink: {
    50: "#fbf6f8",
    100: "#eedce4",
    200: "#e0c1cf",
    300: "#ce9cb3",
    400: "#c1829f",
    500: "#b16185",
    600: "#a54973",
    700: "#962c5c",
    800: "#7f1545",
    900: "#5e0f33",
  },
  red: {
    50: "#fbf6f6",
    100: "#eddcdb",
    200: "#debebd",
    300: "#cb9a97",
    400: "#c18582",
    500: "#b26965",
    600: "#a64f4b",
    700: "#96322c",
    800: "#8a1d17",
    900: "#651511",
  },
  orange: {
    50: "#fcfaf8",
    100: "#f2ece5",
    200: "#e3d7c7",
    300: "#cfb89e",
    400: "#bc9d78",
    500: "#ab8556",
    600: "#9b6c34",
    700: "#845216",
    800: "#684111",
    900: "#56350e",
  },
  yellow: {
    50: "#fefefd",
    100: "#faf9f4",
    200: "#efeddf",
    300: "#e3e0c7",
    400: "#d2cda5",
    500: "#b3a965",
    600: "#948728",
    700: "#756913",
    800: "#584f0e",
    900: "#48410c",
  },
  green: {
    50: "#f9fcfa",
    100: "#deefe7",
    200: "#bbddce",
    300: "#94cab1",
    400: "#6ab593",
    500: "#3fa074",
    600: "#168754",
    700: "#116941",
    800: "#0e5635",
    900: "#0c472c",
  },
  teal: {
    50: "#f6fafb",
    100: "#daeced",
    200: "#badbdd",
    300: "#93c7ca",
    400: "#62adb1",
    500: "#36969b",
    600: "#157b80",
    700: "#106064",
    800: "#0e5053",
    900: "#0b4245",
  },
  cyan: {
    50: "#f7fafb",
    100: "#dfebef",
    200: "#d0e3e8",
    300: "#c0d9e0",
    400: "#90bcc8",
    500: "#79aebd",
    600: "#5f9eb0",
    700: "#35859b",
    800: "#166e86",
    900: "#115568",
  },
  blue: {
    50: "#f4f6f9",
    100: "#d5dfea",
    200: "#b7c7db",
    300: "#96aecb",
    400: "#7796bc",
    500: "#5c81ae",
    600: "#406ca1",
    700: "#1e518f",
    800: "#14427a",
    900: "#103663",
  },
  purple: {
    50: "#f8f6fb",
    100: "#e3dcee",
    200: "#cec2e1",
    300: "#b09dce",
    400: "#9b83c2",
    500: "#8163b1",
    600: "#6f4ca6",
    700: "#5e379c",
    800: "#4f2492",
    900: "#3b1479",
  },
  brand: {
    50: "#fbf6f8",
    100: "#eddce3",
    200: "#debdcb",
    300: "#cb97ae",
    400: "#c1829d",
    500: "#b26486",
    600: "#a54a72",
    700: "#962b5a",
    800: "#891648",
    900: "#641035",
  },
};

export const theme = extendTheme({
  styles: {
    global: {
      // styles for the `body`
      body: {
        bg: "brand.50",
        color: "gray.900",
      },
    },
  },
  fonts: {
    heading: "Inter",
    body: "Inter",
  },
  colors,
  components: {
    Input: {
      baseStyle: {
        field: {
          bg: "white",
          _focus: {
            borderColor: "brand.800",
          },
        },
      },
    },
    Link: {
      baseStyle: {
        color: "brand.800",
        _hover: {
          textDecoration: "none",
          color: "brand.900",
        },
      },
    },
    Select: {
      baseStyle: {
        container: {
          boxShadow: "lg",
          borderRadius: 3,
          padding: 3,
          bg: "white",
          width: "full",
        },
        field: {
          bg: "white",
          _focus: {
            borderColor: "brand.800",
          },
        },
      },
    },
    Checkbox: {
      baseStyle: {
        container: {
          boxShadow: "lg",
          borderRadius: 3,
          padding: 3,
          bg: "white",
          width: "full",
        },
        control: {
          _focus: {
            borderColor: "brand.800",
          },
          _hover: {
            borderColor: "brand.800",
          },
          _checked: {
            bg: "brand.800",
            borderColor: "brand.800",
            _hover: {
              bg: "brand.800",
              borderColor: "brand.800",
            },
          },
        },
      },
    },
  },
});
