import * as utils from './utils';

describe('getTimeAgoString', () => {
  // takes in minutes, returns ms since epoch subtract given minutes
  const minutesAgo = (minutes: number) => {
    const s = minutes * 60;
    return Date.now() / 1000 - s;
  };

  const hoursAgo = (hours: number) => {
    return minutesAgo(hours * 60);
  };

  const daysAgo = (days: number) => {
    return hoursAgo(days * 24);
  };

  it('should return less than a minute ago', () => {
    expect(utils.getTimeAgoString(minutesAgo(0.9))).toBe(
      'less than a minute ago'
    );
  });

  it('should return a minute ago', () => {
    expect(utils.getTimeAgoString(minutesAgo(1.3))).toBe('A minute ago');
  });

  it('should return minutes ago', () => {
    expect(utils.getTimeAgoString(minutesAgo(59))).toBe('59 minutes ago');
  });

  it('should return an hour ago', () => {
    expect(utils.getTimeAgoString(hoursAgo(1.1))).toBe('An hour ago');
  });

  it('should return hours ago', () => {
    expect(utils.getTimeAgoString(hoursAgo(2))).toBe('2 hours ago');
  });

  it('should return a day ago', () => {
    expect(utils.getTimeAgoString(hoursAgo(24))).toBe('A day ago');
  });

  it('should return days ago', () => {
    expect(utils.getTimeAgoString(daysAgo(3))).toBe('3 days ago');
  });

  it('should return a year ago', () => {
    expect(utils.getTimeAgoString(daysAgo(365))).toBe('A year ago');
  });

  it('should return years ago ago', () => {
    expect(utils.getTimeAgoString(daysAgo(365 * 3))).toBe('3 years ago');
  });

  it('should always round down', () => {
    expect(utils.getTimeAgoString(minutesAgo(30.7))).toBe('30 minutes ago');
    expect(utils.getTimeAgoString(daysAgo(1.8))).toBe('A day ago');
    expect(utils.getTimeAgoString(daysAgo(3.9))).toBe('3 days ago');
    expect(utils.getTimeAgoString(daysAgo(365 * 1.9))).toBe('A year ago');
    expect(utils.getTimeAgoString(daysAgo(365 * 5.9))).toBe('5 years ago');
  });
});
