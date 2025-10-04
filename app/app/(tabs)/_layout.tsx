import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="home" options={{ title: "ホーム" , headerShown: false }} />
      <Tabs.Screen name="letters" options={{ title: "お手紙" , headerShown: false}} />
      <Tabs.Screen name="profile" options={{ title: "プロフィール", headerShown: false}} />
    </Tabs>
  );
}