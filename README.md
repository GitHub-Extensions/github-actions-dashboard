# GitHub Dashboard




### Run Local
```sh
npm install

npx vercel dev
```

### Operations Notes
- Delete all secrets from redis:
  - `EVAL "return redis.call('del', unpack(redis.call('keys', ARGV[1])))" 0 *`

