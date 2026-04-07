import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import ScanHome from "../components/Scan/ScanHome";
import * as Clipboard from "expo-clipboard";
import TextRecognition from "@react-native-ml-kit/text-recognition";

global.alert = jest.fn();

// ✅ Mock Image Picker
jest.mock("expo-image-picker", () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(() =>
    Promise.resolve({ granted: true })
  ),
  launchImageLibraryAsync: jest.fn(() =>
    Promise.resolve({
      canceled: false,
      assets: [{ uri: "test-image" }],
    })
  ),
  requestCameraPermissionsAsync: jest.fn(() =>
    Promise.resolve({ granted: true })
  ),
  launchCameraAsync: jest.fn(() =>
    Promise.resolve({
      canceled: false,
      assets: [{ uri: "camera-image" }],
    })
  ),
}));

// ✅ Mock OCR
jest.mock("@react-native-ml-kit/text-recognition", () => ({
  recognize: jest.fn(),
}));

// ✅ Mock Clipboard
jest.mock("expo-clipboard", () => ({
  setStringAsync: jest.fn(),
}));

describe("ScanHome Component", () => {

  // 🔹 Test 1: Render
  test("renders correctly", () => {
    const { getByText } = render(<ScanHome />);

    expect(getByText("Document Scanner")).toBeTruthy();
    expect(getByText("Gallery")).toBeTruthy();
    expect(getByText("Camera")).toBeTruthy();
  });

  // 🔹 Test 2: Gallery click + OCR result
  test("shows extracted text after gallery scan", async () => {
    TextRecognition.recognize.mockResolvedValue({
      text: "Hello World",
    });

    const { getByText } = render(<ScanHome />);

    fireEvent.press(getByText("Gallery"));

    await waitFor(() => {
      expect(getByText("Extracted Text")).toBeTruthy();
      expect(getByText("Copy Text")).toBeTruthy();
    });
  });

  // 🔹 Test 3: Copy button works
  test("copies text to clipboard", async () => {
    TextRecognition.recognize.mockResolvedValue({
      text: "Copy Me",
    });

    const { getByText } = render(<ScanHome />);

    fireEvent.press(getByText("Gallery"));

    await waitFor(() => {
      expect(getByText("Copy Text")).toBeTruthy();
    });

    fireEvent.press(getByText("Copy Text"));

    expect(Clipboard.setStringAsync).toHaveBeenCalled();
  });

  // 🔹 Test 4: Reset button clears state
  test("reset button clears scanned data", async () => {
    TextRecognition.recognize.mockResolvedValue({
      text: "Test Reset",
    });

    const { getByText, queryByText } = render(<ScanHome />);

    fireEvent.press(getByText("Gallery"));

    await waitFor(() => {
      expect(getByText("Scan Again")).toBeTruthy();
    });

    fireEvent.press(getByText("Scan Again"));

    expect(queryByText("Extracted Text")).toBeNull();
  });

});