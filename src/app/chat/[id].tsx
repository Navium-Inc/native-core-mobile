import { Container } from "@/components/screen/container";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";

export default function ChatDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  return (
    <Container>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </Pressable>

      <Text style={styles.title}>Chat {id ?? "details"}</Text>
      <Text style={styles.subtitle}>This is a placeholder chat view.</Text>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 56,
    backgroundColor: "#0f172a",
  },
  backButton: {
    marginBottom: 20,
  },
  backText: {
    color: "#60a5fa",
    fontSize: 16,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    color: "#cbd5e1",
    fontSize: 16,
  },
});
