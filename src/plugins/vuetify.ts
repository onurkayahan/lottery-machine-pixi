// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Vuetify
import { createVuetify } from "vuetify";
import colors from "vuetify/util/colors";

export default createVuetify(
    {
        theme: {
            themes: {
                light: {
                    dark: false,
                    colors: {
                        primary: colors.grey.lighten1,
                        secondary: colors.grey.lighten4,
                        background: colors.grey.lighten5,
                    },
                },
                dark: {
                    dark: true,
                    colors: {
                        primary: colors.grey.darken4,
                        secondary: colors.grey.darken3,
                        background: colors.grey.darken1,
                    },
                },
            },
        },
    }
    // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
);
