import {Injectable} from '@angular/core';
import {Observable, Observer, Subscription} from 'rxjs';
import {filter, share} from 'rxjs/operators';
import {EventCustom} from '../models/event.model';

/**
 * A utility service that helps manage internal events in an Angular application using RxJS's Observable mechanism
 *
 * Main features:
 *   - Allows broadcasting events with a custom name and payload.
 *   - Allows components/services to subscribe to one or multiple event names.
 *   - Supports unsubscribing when no longer needed to prevent memory leaks.
 *
 * Advantages:
 *   - No need for direct connection between components.
 *   - Simple, lightweight, and easy to use — suitable when you don't want to use a full state management library like NgRx
 *
 * Usage examples:
 *
 * 1. Broadcast an event from somewhere in the app (e.g., after creating a user)
 *  ```ts
 *     this.eventManager.broadcast({
 *       name: 'user.created',
 *       content: { id: 1, name: 'Alice' }
 *     });
 *  ```
 * 2. Subscribe to the event in another component
 *  ```ts
 *     const subscription = this.eventManager.subscribe('user.created', (event) => {
 *       if (event instanceof EventCustom) {
 *         console.log('User created:', event);
 *       }
 *     });
 *  ```
 *
 * 3. Unsubscribe when done (usually in ngOnDestroy)
 *  ```ts
 *     this.eventManager.destroy(subscription);
 *  ```
 *
 * @author thoaidc
 */
@Injectable({
  providedIn: 'root',
})
export class EventManager {
  observable: Observable<EventCustom<unknown> | string>;
  observer?: Observer<EventCustom<unknown> | string>;

  constructor() {
    this.observable = new Observable((observer: Observer<EventCustom<unknown> | string>) => {
      this.observer = observer;
    }).pipe(share());
  }

  /**
   * Method to broadcast the event to observer
   */
  broadcast(event: EventCustom<unknown> | string): void {
    if (this.observer) {
      this.observer.next(event);
    }
  }

  /**
   * Method to subscribe to an event with callback
   * @param eventNames  Single event name or array of event names to what subscribe
   * @param callback    Callback to run when the event occurs
   */
  subscribe(eventNames: string | string[], callback: (event: EventCustom<unknown> | string) => void): Subscription {
    if (typeof eventNames === 'string') {
      eventNames = [eventNames];
    }

    return this.observable
      .pipe(
        filter((event: EventCustom<unknown> | string) => {
          for (const eventName of eventNames) {
            if ((typeof event === 'string' && event === eventName) || (typeof event !== 'string' && event.name === eventName)) {
              return true;
            }
          }

          return false;
        }),
      )
      .subscribe(callback);
  }

  /**
   * Method to unsubscribe the subscription
   */
  destroy(subscriber: Subscription): void {
    subscriber.unsubscribe();
  }
}
