// 雪花ID生成器
class Snowflake {
  constructor() {
    this.epoch = 1609459200000; // 设置起始时间戳 (2021-01-01)
    this.workerId = Math.floor(Math.random() * 31) + 1; // 1-31之间的随机数作为机器ID
    this.sequence = 0;
    this.workerIdBits = 5;
    this.sequenceBits = 12;
    this.workerIdShift = this.sequenceBits;
    this.timestampLeftShift = this.sequenceBits + this.workerIdBits;
    this.sequenceMask = -1 ^ (-1 << this.sequenceBits);
    this.lastTimestamp = -1;
  }

  // Base64字符集（去除可能引起混淆的字符如0,O,1,l,+,/）
  static BASE64_CHARS = 'ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';

  // 将数字转换为自定义的Base64字符串
  toBase64(num) {
    let result = '';
    let value = BigInt(num);
    const base = BigInt(Snowflake.BASE64_CHARS.length);
    
    while (value > 0) {
      const remainder = Number(value % base);
      result = Snowflake.BASE64_CHARS[remainder] + result;
      value = value / base;
    }
    
    result = result || Snowflake.BASE64_CHARS[0];
    
    // 确保ID长度至少为20位
    while (result.length < 20) {
      const randomIndex = Math.floor(Math.random() * Snowflake.BASE64_CHARS.length);
      result = Snowflake.BASE64_CHARS[randomIndex] + result;
    }
    
    return result;
  }

  // 生成下一个ID
  nextId() {
    let timestamp = Date.now();

    // 如果当前时间小于上一次ID生成的时间戳，说明系统时钟回退过
    if (timestamp < this.lastTimestamp) {
      throw new Error('Clock moved backwards. Refusing to generate id');
    }

    // 如果是同一时间生成的，则进行毫秒内序列
    if (this.lastTimestamp === timestamp) {
      this.sequence = (this.sequence + 1) & this.sequenceMask;
      // 毫秒内序列溢出
      if (this.sequence === 0) {
        // 阻塞到下一个毫秒，获得新的时间戳
        timestamp = this.tilNextMillis(this.lastTimestamp);
      }
    } else {
      // 时间戳改变，毫秒内序列重置
      this.sequence = 0;
    }

    this.lastTimestamp = timestamp;

    // 移位并通过或运算拼到一起组成64位的ID
    const timestampDiff = timestamp - this.epoch;
    const numericId = (
      (BigInt(timestampDiff) << BigInt(this.timestampLeftShift)) |
      (BigInt(this.workerId) << BigInt(this.workerIdShift)) |
      BigInt(this.sequence)
    );
    
    // 转换为Base64字符串
    return this.toBase64(numericId);
  }

  // 阻塞到下一个毫秒，直到获得新的时间戳
  tilNextMillis(lastTimestamp) {
    let timestamp = Date.now();
    while (timestamp <= lastTimestamp) {
      timestamp = Date.now();
    }
    return timestamp;
  }
}

// 导出雪花ID生成器实例
const snowflake = new Snowflake();
export default snowflake;