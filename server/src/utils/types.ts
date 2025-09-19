export enum TimeUnit {
  SECOND = 1000,
  MINUTE = 60 * 1000,
  HOUR = 60 * 60 * 1000,
  DAY = 24 * 60 * 60 * 1000,
  WEEK = 7 * 24 * 60 * 60 * 1000,
  MONTH = 30 * 24 * 60 * 60 * 1000,
  YEAR = 365 * 24 * 60 * 60 * 1000,
}

export enum SizeUnit {
    BYTE = 1,
    KILOBYTE = 1024,
    MEGABYTE = 1024 * 1024,
    GIGABYTE = 1024 * 1024 * 1024,
    TERABYTE = 1024 * 1024 * 1024 * 1024,
}