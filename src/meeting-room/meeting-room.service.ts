import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { MeetingRoom } from './entities/meeting-room.entity';
import { EntityManager, Like, Repository } from 'typeorm';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';

@Injectable()
export class MeetingRoomService {
  @InjectRepository(MeetingRoom)
  private repository: Repository<MeetingRoom>;

  initData() {
    const room1 = new MeetingRoom();
    room1.name = '木星';
    room1.capacity = 10;
    room1.equipment = '白板';
    room1.location = '一层西';

    const room2 = new MeetingRoom();
    room2.name = '金星';
    room2.capacity = 5;
    room2.equipment = '';
    room2.location = '二层东';

    const room3 = new MeetingRoom();
    room3.name = '天王星';
    room3.capacity = 30;
    room3.equipment = '白板，电视';
    room3.location = '三层东';

    this.repository.insert([room1, room2, room3]);
  }

  async find(
    pageNo: number,
    pageSize: number,
    name: string,
    capacity: number,
    location: string,
  ) {
    const skipCount = (pageNo - 1) * pageSize;

    const condition: Record<string, any> = {};
    if (name) {
      condition.name = Like(`%${name}%`);
    }
    if (capacity) {
      condition.capacity = Like(`%${capacity}%`);
    }
    if (location) {
      condition.location = Like(`%${location}%`);
    }

    const [meetingRooms, totalCount] = await this.repository.findAndCount({
      skip: skipCount,
      take: pageSize,
      where: condition,
    });

    return {
      meetingRooms,
      totalCount,
    };
  }

  async create(meetingRoomDto: CreateMeetingRoomDto) {
    const room = await this.repository.findOneBy({
      name: meetingRoomDto.name,
    });
    if (room) {
      throw new BadRequestException('会议室名字已存在');
    }

    return await this.repository.insert(meetingRoomDto);
  }

  async update(meetingRoomDto: UpdateMeetingRoomDto) {
    const room = await this.repository.findOneBy({
      id: meetingRoomDto.id,
    });

    if (!room) {
      throw new BadRequestException('会议室不存在');
    }

    room.name = meetingRoomDto.name;
    room.capacity = meetingRoomDto.capacity;
    room.location = meetingRoomDto.location;

    if (meetingRoomDto.description) {
      room.description = meetingRoomDto.description;
    }
    if (meetingRoomDto.equipment) {
      room.equipment = meetingRoomDto.equipment;
    }

    await this.repository.update(
      {
        id: room.id,
      },
      room,
    );
    return 'success';
  }

  async findById(id: number) {
    return await this.repository.findOneBy({ id });
  }

  @InjectEntityManager()
  entityManager: EntityManager;
  async delete(id: number) {
    // const bookings = await this.entityManager.findBy(Booking, {
    //   room: {
    //     id,
    //   },
    // });
    // for (let i = 0; i < bookings.length; i++) {
    //   this.entityManager.delete(Booking, bookings[i].id);
    // }
    const room = await this.repository.findOneBy({ id });
    if (!room) {
      throw new BadRequestException('会议室不存在');
    }
    await this.repository.delete(id);
    return 'success';
  }
}
