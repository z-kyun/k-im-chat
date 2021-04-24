import { User } from './entities/user.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResDto } from 'src/common/dtos/res.dto';
import { UserList } from './dtos/user.dto';
import { AuthService } from 'src/auth/auth.service';
import { UserMap } from '../friend/entities/friend.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserMap)
    private readonly userMapRepository: Repository<UserMap>,
    private readonly authService: AuthService,
  ) {}

  /**
   * @description: 获取用户信息
   * @param {String} username 用户名
   * @author kyun
   * @date 2021/3/18
   */
  async getUser(username: string): Promise<ResDto> {
    const data = await this.userRepository.findOne({ username });
    if (data) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, salt, createdAt, ...user } = data;
      return { code: 200, msg: '成功', data: user };
    } else {
      return { code: 400, msg: '查无此用户' };
    }
  }

  /**
   * @description: 获取用户信息
   * @param {Number} query[page] 页码
   * @param {Number} query[size] 数量
   * @param {String} query[keyword] 关键词
   * @author kyun
   * @date 2021/3/18
   */
  async getList(query: UserList, token: string): Promise<ResDto> {
    try {
      const { page, size, keyword } = query;
      // 获取当前用户的信息
      const user = await this.authService.decodeToken(token);
      const fuids = (await this.userMapRepository.find({ uid: user.id })).map(
        (v) => v.fuid,
      );
      Logger.log(`fuids -> ${fuids.join(', ')}`);
      const DB = this.userRepository
        .createQueryBuilder('user')
        .where(`user.username in %${keyword}%`)
        .andWhere(`user.id not in (${fuids.join(',')})`);

      const total = await DB.getCount();
      const data = await DB.skip(page)
        .take(size)
        .orderBy('user.id', 'ASC')
        .getMany();
      const list = data.map((v) => {
        const { id, username, avatar } = v;
        return { id, username, avatar };
      });
      return { code: 200, msg: '成功', data: { total, list } };
    } catch (e) {
      return e;
    }
  }
}
