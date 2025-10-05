import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="home" options={{ title: "ホーム" , headerShown: false }} />
    </Tabs>
  );
}