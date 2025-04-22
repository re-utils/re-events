import { bench, do_not_optimize, run, summary } from 'mitata';

import * as topic from 're-events/topic';
import picobus from 'picobus';
import nanops from 'nano-pubsub';
import mitt from 'mitt';

summary(() => {
  {
    const numbers = topic.init<number>();
    for (let i = 0; i < 1e2; i++)
      topic.attach(numbers, () => do_not_optimize(i));

    bench('re-events', () => {
      for (let i = 0; i < 1e2; i++)
        topic.publish(numbers, i);
    });
  }

  {
    const numbers = picobus<number>();
    for (let i = 0; i < 1e2; i++)
      numbers.listen(() => do_not_optimize(i));

    bench('picobus', () => {
      for (let i = 0; i < 1e2; i++)
        numbers.dispatch(i);
    });
  }

  {
    const numbers = nanops<number>();
    for (let i = 0; i < 1e2; i++)
      numbers.subscribe(() => do_not_optimize(i));

    bench('nano-pubsub', () => {
      for (let i = 0; i < 1e2; i++)
        numbers.publish(i);
    });
  }

  {
    const numbers = mitt<{ a: number }>();
    for (let i = 0; i < 1e2; i++)
      numbers.on('a', () => do_not_optimize(i));

    bench('mitt', () => {
      for (let i = 0; i < 1e2; i++)
        numbers.emit('a', i);
    });
  }
});

run();
