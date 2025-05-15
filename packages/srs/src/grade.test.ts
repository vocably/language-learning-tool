import { StudyStrategy } from '@vocably/model';
import { buildDueDate } from './dueDate';
import { grade } from './grade';
import { createSrsItem } from './item';

describe('grade', () => {
  it('should ask a good card in 6 days of good responses', () => {
    let item = createSrsItem();
    const strategy: StudyStrategy = [
      { step: 'mf', allowedFailures: null },
      { step: 'sf', allowedFailures: 0 },
      { step: 'mb', allowedFailures: null },
      { step: 'sb', allowedFailures: 0 },
    ];

    item = grade(item, 5, strategy);
    expect(item.repetition).toEqual(1);
    expect(item.interval).toEqual(1);
    expect(item.state.s).toEqual('sf');

    item = grade(item, 5, strategy);
    expect(item.repetition).toEqual(2);
    expect(item.interval).toEqual(1);
    expect(item.state.s).toEqual('mb');

    item = grade(item, 5, strategy);
    expect(item.repetition).toEqual(3);
    expect(item.interval).toEqual(1);
    expect(item.state.s).toEqual('sb');

    item = grade(item, 5, strategy);
    expect(item.repetition).toEqual(4);
    expect(item.interval).toEqual(6);
    expect(item.state.s).toEqual('mf');
  });

  it('should reduce efactor and not change card state on 3', () => {
    let item = createSrsItem();
    item.state = {
      s: 'sb',
      f: 0,
    };
    item.eFactor = 2.5;
    item.interval = 4;
    item.repetition = 5;

    const strategy: StudyStrategy = [
      { step: 'mf', allowedFailures: null },
      { step: 'sf', allowedFailures: 0 },
      { step: 'mb', allowedFailures: null },
      { step: 'sb', allowedFailures: 0 },
    ];

    item = grade(item, 3, strategy);
    expect(item.repetition).toEqual(5);
    expect(item.interval).toEqual(4);
    expect(item.state.s).toEqual('sb');
    expect(item.eFactor).toEqual(2.36);
    expect(item.dueDate).toEqual(buildDueDate(1));
  });

  it('should move on to the next interval when total successful repetitions are more than twice of strategy items', () => {
    let item = createSrsItem();
    item.state = {
      s: 'mb',
      f: 0,
    };
    item.eFactor = 2.5;
    item.interval = 6;
    item.repetition = 8;

    const strategy: StudyStrategy = [
      { step: 'mf', allowedFailures: null },
      { step: 'sf', allowedFailures: 0 },
      { step: 'mb', allowedFailures: null },
      { step: 'sb', allowedFailures: 0 },
    ];

    item = grade(item, 5, strategy);
    expect(item.repetition).toEqual(9);
    expect(item.interval).toEqual(15);
    expect(item.state.s).toEqual('sb');
    expect(item.eFactor).toEqual(2.53);
    expect(item.dueDate).toEqual(buildDueDate(15));
  });
});
