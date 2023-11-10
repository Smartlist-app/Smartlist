"use client";

import { ConfirmationModal } from "@/components/ConfirmationModal";
import { ErrorHandler } from "@/components/Error";
import { useNotificationSubscription } from "@/components/Layout/NotificationsPrompt";
import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  ListItem,
  ListItemText,
  Switch,
} from "@mui/material";
import toast from "react-hot-toast";
import useSWR from "swr";

/**
 * Top-level component for the notification settings page.
 */
export default function Notifications() {
  const { session } = useSession();
  const { data, mutate, error } = useSWR(["user/settings/notifications"]);

  const {
    subscription,
    enabledOnCurrentDevice,
    subscribeButtonOnClick,
    unsubscribeButtonOnClick,
    sendNotificationButtonOnClick,
  } = useNotificationSubscription(session);

  const handleNotificationChange = async (name, value) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        await fetchRawApi(session, "user/settings/notifications", {
          method: "PUT",
          params: {
            name: name,
            value: value ? "true" : "false",
          },
        });
        await mutate();
        resolve("");
      } catch (error: any) {
        reject(error.message);
      }
    });

    toast.promise(promise, {
      loading: "Saving...",
      success: "Saved!",
      error: "Failed to save",
    });
  };

  const enabledOnAnotherDevice =
    subscription !== null && enabledOnCurrentDevice === false;
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const notificationSettings = [
    {
      key: "accountUpdates",
      comingSoon: false,
      disabled: true,
      enabled: true,
      primary: "Account",
      secondary: "Recieve security notifications",
    },
    {
      key: "planDay",
      comingSoon: false,
      disabled: false,
      enabled: null,
      primary: "Plan my day",
      secondary: "Nudge to plan your day every morning",
    },
    {
      key: "followerUpdates",
      comingSoon: false,
      disabled: false,
      enabled: null,
      primary: "Friend requests",
      secondary: "",
    },
    {
      key: "todoListUpdates",
      comingSoon: false,
      disabled: false,
      enabled: null,
      primary: "Tasks",
      secondary: "Recieve notifiations when you set due dates to tasks",
    },
    {
      key: "statusUpdates",
      comingSoon: false,
      disabled: false,
      enabled: null,
      primary: "Status updates",
      secondary: "Get notified when your friends set their status",
    },
    {
      key: "boardUpdates",
      comingSoon: false,
      disabled: false,
      enabled: null,
      primary: "Boards",
      secondary: "Updating/deleting a column, etc.",
    },
    {
      key: "lowItemCount",
      comingSoon: true,
      disabled: false,
      enabled: null,
      primary: "Low item count reminders",
      secondary:
        "Recieve a notification when you have less than 5 items in your inventory",
    },
  ];

  return (
    <>
      {data ? (
        <Box sx={{ mb: 3 }}>
          <ListItem disableGutters>
            <ListItemText
              primary="Status updates"
              secondary="Notify others when I change my status"
            />
            <Switch
              checked={data.notifyFriendsForStatusUpdates}
              onClick={(e: any) =>
                handleNotificationChange(
                  "notifyFriendsForStatusUpdates",
                  e.target.checked
                )
              }
            />
          </ListItem>
          <Divider sx={{ my: 4 }} />
          <ListItem
            sx={{
              background: palette[3],
              borderRadius: 3,
              mb: 2,
            }}
          >
            <ListItemText
              primary="Enable notifications"
              secondary={
                <>
                  <span
                    style={{
                      display: "block",
                    }}
                  >
                    Receive push notifications on one device
                  </span>
                  <Button
                    onClick={sendNotificationButtonOnClick}
                    disabled={!enabledOnCurrentDevice}
                    variant="outlined"
                    size="small"
                    sx={{
                      mt: 1,
                      boxShadow: 0,
                    }}
                  >
                    Send test notification
                  </Button>
                </>
              }
            />
            <button
              style={{ display: "none" }}
              id="enable-notifications"
              onClick={(event) => subscribeButtonOnClick(event)}
            />
            {enabledOnAnotherDevice ? (
              <ConfirmationModal
                title="Recieve notifications on this device?"
                question="If you've enabled notifications on another device, enabling them here will disable them on the other device."
                callback={() =>
                  document.getElementById("enable-notifications")?.click()
                }
              >
                <Button variant="contained">Enable</Button>
              </ConfirmationModal>
            ) : (
              <Switch
                checked={enabledOnCurrentDevice === true}
                onClick={(event) => {
                  if (enabledOnCurrentDevice === true) {
                    unsubscribeButtonOnClick(event);
                  } else {
                    subscribeButtonOnClick(event);
                  }
                }}
              />
            )}
          </ListItem>
          {/* Map through the notification settings */}
          {notificationSettings.map((setting) => (
            <ListItem key={setting.key} disableGutters>
              <ListItemText
                primary={
                  <>
                    {setting.primary}
                    {setting.comingSoon && (
                      <Chip
                        size="small"
                        label="Coming soon"
                        sx={{ fontWeight: 700, ml: 1 }}
                      />
                    )}
                  </>
                }
                secondary={setting.secondary}
              />
              <Switch
                disabled={setting.comingSoon || setting.disabled}
                checked={setting.enabled || data[setting.key]}
                onClick={(e: any) =>
                  handleNotificationChange(setting.key, e.target.checked)
                }
              />
            </ListItem>
          ))}
        </Box>
      ) : error ? (
        <ErrorHandler
          callback={() => mutate()}
          error="An error occured while trying to fetch your notification settings"
        />
      ) : (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={30} />
        </Box>
      )}
    </>
  );
}
