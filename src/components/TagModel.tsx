import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";

const predefinedTags = ["Potential Hire", "Explore Later", "Follow-up Required"];

export const TagModal = ({ visible, onClose, onSave, selectedTags }) => {
  const [selected, setSelected] = useState(selectedTags || []);
  const [customTag, setCustomTag] = useState("");

  const toggleTag = (tag) => {
    setSelected(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = () => {
    const finalTags = customTag ? [...selected, customTag.trim()] : selected;
    onSave(finalTags);
    setCustomTag("");
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{ flex: 1, backgroundColor: "#000000aa", justifyContent: "center" }}>
        <View style={{ margin: 20, padding: 20, backgroundColor: "#fff", borderRadius: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Select Tags</Text>

          <ScrollView style={{ maxHeight: 200 }}>
            {predefinedTags.map(tag => (
              <TouchableOpacity key={tag} onPress={() => toggleTag(tag)} style={{ paddingVertical: 8 }}>
                <Text style={{ color: selected.includes(tag) ? "#000" : "#888" }}>
                  {selected.includes(tag) ? "✓ " : ""}{tag}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TextInput
            value={customTag}
            onChangeText={setCustomTag}
            placeholder="Enter custom tag"
            style={{ borderBottomWidth: 1, borderColor: "#ccc", marginTop: 10 }}
          />

          <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 20 }}>
            <TouchableOpacity onPress={onClose} style={{ marginRight: 10 }}>
              <Text style={{ color: "red" }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave}>
              <Text style={{ color: "blue" }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
