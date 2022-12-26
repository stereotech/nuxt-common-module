export class Notification {
  constructor(context) {
    this.context = context;
  }
  call(message) {
    const closeAction = {
      text: "",
      icon: "close",
      onClick: (e, toastObject) => {
        toastObject.goAway(0);
      }
    };
    const iconFromType = (type) => {
      if (type === "success") {
        return "check";
      } else if (type === "error") {
        return "alert-circle";
      } else {
        return "information";
      }
    };
    document.body.clientWidth;
    this.context.app.$toast.show(message.text, {
      icon: iconFromType(message.type),
      type: message.type,
      fullWidth: document.body.clientWidth <= 960,
      fitToScreen: document.body.clientWidth <= 960,
      duration: message.timeout || 6e3,
      action: [
        ...(message.actions || []).map((a) => {
          return {
            text: a.text,
            onClick: (e, toastObject) => {
              a.onClick(e);
              if (a.closeOnClick) {
                toastObject.goAway(0);
              }
            }
          };
        }),
        closeAction
      ]
    });
  }
}
