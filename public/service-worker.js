async function triggerNotification(e) {

    try {
        var options = {
                icon: '/img/logo.png',
                badge: "/img/logo.png",
                requireInteraction: true,
                vibrate: [500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110, 170, 40, 500]
            },
            title = e.title,
            body = e.body,
            image = e.image,
            sound = e.sound,
            timestamp = e.timestamp,
            groupingTag = e.groupingTag,
            link = e.link,
            execute = e.trigger;

            console.log(e);
            console.log(title);

        if (body) {
            options.body = body;
        } else {
            options.body = 'notification from Algonex';
        }
        if (image) {
            options.image = image;
        }
        if (sound) {
            options.sound = sound;
        } else {
            options.sound = '/aud/bellStruck.mp3';
        }
        if (timestamp) {
            options.timestamp = timestamp;
        }
        if (groupingTag) {
            options.renotify = true;
            options.tag = groupingTag;
        }
        if (e.existWhenFocus || await !isClientFocused()) {
            return self.registration.showNotification(title, options);
        } else {
            return null;
        }
    } catch (error){
        console.error(error);
    }
}

self.addEventListener('message', function (event) {
    console.log('Received message from page.', event.data);
    triggerNotification(event.data);
    /*self.dispatchEvent(new PushEvent('push', {
        data: event.data
    }));*/
});

/*self.addEventListener('push', function (event) {
    
    triggerNotification(event.data);
});*/

function focusWindow(event) {
    var data = event.notification.data;
    console.log('clicking ='+data);
    const urlToOpen = new URL(data.link, self.location.origin).href;
    const promiseChain = clients.matchAll({
        type: 'window',
        includeUncontrolled: true
    }).then((windowClients) => {
        var matchingClient = null;

        for (var i = 0; i < windowClients.length; i++) {
            const windowClient = windowClients[i];
            if (windowClient.url === urlToOpen) {
                matchingClient = windowClient;
                break;
            }
        }
        if (matchingClient) {
            var execute = data.trigger;
            if (execute) {
                execute();
            }
            return matchingClient.focus();
        } else {
            return clients.openWindow(urlToOpen);
        }
    });
    event.waitUntil(promiseChain);
}

function isClientFocused() {
    return clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        })
        .then((windowClients) => {
            var clientIsFocused = false;
            for (var i = 0; i < windowClients.length; i++) {
                const windowClient = windowClients[i];
                if (windowClient.focused) {
                    clientIsFocused = true;
                    break;
                }
            }

            return clientIsFocused;
        });
}

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    focusWindow(event);
});


const notificationCloseAnalytics = () => {
    return Promise.resolve();
};
self.addEventListener('notificationclose', function (event) {
    const promiseChain = notificationCloseAnalytics();
    event.waitUntil(promiseChain);
});