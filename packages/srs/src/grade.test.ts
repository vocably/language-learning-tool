import { StudyStrategy } from '@vocably/model';
import { grade } from './grade';
import { createSrsItem } from './item';

describe('grade', () => {
  it('should ask a good card in 6 days', () => {
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
});
