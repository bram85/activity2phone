Activity2Phone
==============

Activity2Phone monitors your presence at your PC and sends a signal to your Android phone when you leave your PC again. This is based on a certain period of inactivity.

The use case for this is to disable automatic sync functionality on your Android phone while you are at your computer. It makes little sense to keep your phone synced while you have GMail and Google Calendar at your disposal on the big screen. In the end, this will make your phone's battery last longer.

Activity2Phone will emit a signal to your phone as soon as it detects that you left your PC or became active again.

This is accomplished with the [Notify My Android] [1] service (NMA). To make Activity2Phone to phone work, you need to create an account at NMA, install the [Android NMA application] [2] and create an API key associated with your NMA account.

You will also need [Tasker] [3] to listen for the events emitted by NMA. Tasker supports NMA as a 3rd party plugin. When an *active* notification is passed to your phone, Tasker could be configured to disable automatic background synchronization. Conversely, when an *idle* notification is sent, Tasker could enable background syncing again. Tasker should listen for the application name *Activity2Phone* and the events *User is idle* and *User is active*.

NMA is free for only five notifications per day. This may not be enough to make Activity2Phone work reliably. You can purchase a license inside the Android application which allows you to push an unlimited amount of notifications to your phone.

Tasker has a price tag too, but it has a 7 day trial period. However, Tasker is well worth the money given the incredible power it will give to your phone.

[1]: http://www.notifymyandroid.com "Notify My Android"
[2]: https://play.google.com/store/apps/details?id=com.usk.app.notifymyandroid
[3]: https://play.google.com/store/apps/details?id=net.dinglisch.android.taskerm
