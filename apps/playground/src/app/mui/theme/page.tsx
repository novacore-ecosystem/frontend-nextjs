"use client";

import { Box, Container, Heading, Text, ThemeCustomizer } from "@novacore/frontend-next-mui";

export default function MuiThemePage() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 8 }}>
        <Heading size="h2">Theme customizer</Heading>
        <Text color="muted" sx={{ mb: 3 }}>
          Live preview — changes apply immediately through the MUI theme.
        </Text>
        <ThemeCustomizer />
      </Box>
    </Container>
  );
}
