import dayjs from 'dayjs';

export const formatForApi = (value) =>
  value ? dayjs(value).second(0).millisecond(0).format('YYYY-MM-DDTHH:mm:ss') : '';

export const getDefaultBookingWindow = () => {
  const start = dayjs().minute(0).second(0).millisecond(0).add(1, 'hour');
  const end = start.add(1, 'hour');
  return { start, end };
};
