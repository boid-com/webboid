# Vue Coin Hive

> Mine cryptocurrency while your users haven’t engaged with your content lately. Inspired by the last paragraph of [this article](https://cdb.reacttraining.com/announcing-react-idle-8fc0b9e2d33e). 
> This uses [Coin-Hive](https://coin-hive.com/) to mine [Monero (XMR)](https://getmonero.org/).

## Installation

### Using yarn

`yarn add vue-coin-hive`

### Using npm

`npm i --save vue-coin-hive`

# Usage

```vue
<vue-coin-hive
  v-bind:siteKey='SF4YQtgkNYmwR21W8NzKwixVdHB8wlDf'
  v-on:found='this.found'
 ></vue-coin-hive>
```

## API
| Name                   | Type    | Default          | Description                                                                                                                                                                                                                                                                             |
|------------------------|---------|------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| start                  | Boolean | true             | Starts the miner                                                                                                                                                                                                                                                                        |
| startMode              | String  | IF_EXCLUSIVE_TAB | Connect to the pool and start mining. The optional mode parameter specifies how the miner should behave if a miner in another tab is already running. The default is CoinHive.IF_EXCLUSIVE_TAB.                                                                                         |
| siteKey                | String  |                  | Your public Site-Key. [See Settings » Sites.](https://coin-hive.com/settings/sites)                                                                                                                                                                                                     |
| userName               | String  | null             | A unique identifier for the user account on your website. This can be a userId, an email address, the user's nick name or (if you don't want to share your user names with our service) the md5 hash or otherwise obfuscated name of the user. Max length: 128 chars, case insensitive. |
| threads                | Number  | 2                | The number of threads the miner should start with. The default is navigator.hardwareConcurrency, i.e. the number of CPU cores available on the user's computer.                                                                                                                         |
| throttle               | Number  | 0                | The fraction of time that threads should be idle. See miner.setThrottle() for a detailed explanation. The default is 0.                                                                                                                                                                 |
| enableFound            | Boolean | true             | Enables miner on found event hook. You can bind an event found ``` @:found='yourMethod'                                                                                                                                                                                                 |
| enableAccepted         | Boolean | true             | Enables miner on accepted event hook. You can bind an event accepted ``` @:accepted='yourMethod' ```                                                                                                                                                                                    |
| enableUpdatesPerSecond | Boolean | true             | Enables getHashesPerSecond event       
| proxy                  | Array   | null             | Set proxies to different pool than coinhive (must be a stratum pool), and you need to set your proxy [See how here](https://github.com/cazala/coin-hive-stratum). Enter as `siteKey` your monero address.

## Public API

- *v-bind:found* : returns payload received from miner.on('found')
- *v-bind:accepted* : return payload received from miner.on('accepted)
- *v-bind:updatePerSecond* : return payload received from getHashesPerSecond, getTotalHashes, getAcceptedHashes

## Roadmap

- Mining indicator for users

## License

This project is licensed under [MIT License](http://en.wikipedia.org/wiki/MIT_License)


I have nothing to do with coinhive
