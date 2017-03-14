import { Pin } from '../models/pin';
import { Address } from '../models/Address';
import { Group } from '../models/Group';
import { Participant } from '../models/participant';
export class MockTestData {
    constructor() {
    }

/**
 * 
 * @param designator 
 * @param hostStatus 
 * @param pinType 
 * @param isFormDirty 
 */
    public static getAPin(designator = 1, hostStatus = 3, pinType = 1, numParticipantsInGathering = 5, isFormDirty = false): Pin {
        return new Pin(
            'firstName' + designator.toString(),
            'lastName' + designator.toString(),
            'email' + designator.toString() + '@address.com',
            designator,
            designator,
            this.getAnAddress(designator),
            hostStatus,
            this.getAGroup(designator, numParticipantsInGathering),
            designator,
            isFormDirty,
            'site' + designator.toString(),
            pinType
        )
    }

    public static getAnAddress(designator = 1): Address{
        return new Address(
                designator,
                'addressline1' + designator.toString(),
                'addressline2' + designator.toString(),
                'city' + designator.toString(),
                'state' + designator.toString(),
                '17272',
                123123123,
                123123123
            )
    }

    public static getAParticipantsArray(numOfParticipants = 5): Participant[] {
        let participants = new Array<Participant>();
        for (var index = 0; index < numOfParticipants; index++) {
            let participant = new Participant(
                'congregation', 
                index, 
                'displayName' + index.toString(), 
                'email' + index.toString() + '@address.com',
                index,
                1,
                'title' + index.toString(),
                true,
                'lastName' + index.toString(),
                'nickName' + index.toString(),
                index,
                new Date(2016, 5).toDateString()
            );
            participants.push(participant);
        };
        return participants;
    }

    public static getAGroup(designator = 1, numParticipantsInGathering = 5): Group {
        return new Group(
            designator,
            'groupName' + designator.toString(),
            'groupDescription' + designator.toString(),
            'Anywhere',
            1,
            1,
            'congregation' + designator.toString(),
            designator,
            designator,
            new Date(2016, 5).toDateString(),
            null,
            0,
            true,
            5,
            false,
            false,
            0,
            false,
            3,
            'meetingDay',
            'meetingTime',
            'erryday',
            3,
            this.getAnAddress(designator),
            10,
            false,
            23,
            this.getAParticipantsArray(numParticipantsInGathering)
        );
    }
}