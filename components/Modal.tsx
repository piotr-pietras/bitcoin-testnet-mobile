import { StyleSheet } from "react-native";
import { Modal as PaperModal, Portal } from "react-native-paper";
import {
  forwardRef,
  PropsWithChildren,
  useImperativeHandle,
  useState,
} from "react";
import { AppTheme, useTheme } from "@/services/theme";

export type ModalRef = { open: () => void; close: () => void };

type Props = {};

export const Modal = forwardRef<ModalRef, PropsWithChildren<Props>>(
  ({ children }, ref) => {
    const [visible, setVisible] = useState(false);
    const theme = useTheme();
    const styles = stylesBuilder(theme);
    useImperativeHandle(
      ref,
      () => {
        return {
          open: () => setVisible(true),
          close: () => setVisible(false),
        };
      },
      []
    );

    const hideModal = () => setVisible(false);

    return (
      <Portal>
        <PaperModal
        
          style={styles.container}
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.contentContainer}
        >
          {children}
        </PaperModal>
      </Portal>
    );
  }
);

const stylesBuilder = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      margin: theme.sizes.m,
    },
    contentContainer: {
      padding: theme.sizes.m,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.roundness,
    },
  });
