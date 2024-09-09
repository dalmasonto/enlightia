import { Title, Text, useMantineTheme } from '@mantine/core';
import classes from './Welcome.module.css';

export function Welcome() {
  const theme = useMantineTheme()
  return (
    <>
      {/* <Title className={classes.title} ta="center" my={50}>
        Welcome to{' '}
        <Text inherit variant="gradient" component="span" gradient={{ from: theme.colors[theme.primaryColor][9], to: theme.colors[theme.primaryColor][5] }}>
          Enlightia
        </Text>
      </Title> */}
      <Title className={classes.title} lh={'80px'} ta={'center'} py={'30px'}>
        <Text inherit variant="gradient" size='' component="span" gradient={{ from: theme.colors[theme.primaryColor][9], to: theme.colors[theme.primaryColor][5] }}>
          Take Your Time
        </Text>
        <br /> and learn from anywhere
      </Title>
    </>
  );
}
