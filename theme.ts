import { Container, createTheme, rem } from '@mantine/core';
import { bai, karla } from './fonts';

const CONTAINER_SIZES: Record<string, string> = {
  xxs: rem(300),
  xs: rem(400),
  sm: rem(600),
  md: rem(800),
  lg: rem(1200),
  xl: rem(1800),
  xxl: rem(3600),
};

export const theme = createTheme({
  fontFamily: bai.style.fontFamily,
  // fontFamily: karla.style.fontFamily,
  primaryColor: 'grape',
  components: {
    Container: Container.extend({
      vars: (_, { size, fluid }) => ({
        root: {
          '--container-size': fluid
            ? '100%'
            : size !== undefined && size in CONTAINER_SIZES
              ? CONTAINER_SIZES[size]
              : rem(size),
        },
      }),
    }),
  },
});
