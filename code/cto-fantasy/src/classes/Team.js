import { average } from "../utils/number";
import { randomInt, randomBoolean } from "../utils/random";
import { Tester } from "./Employee";

export class Team {
  members = [];
  velocities = [];
  constructor(members = []) {
    this.members = members;
  }

  add(member) {
    this.members.push(member);
  }

  remove(member) {
    this.members = this.members.filter((m) => m !== member);
  }

  update({ velocity }) {
    if (velocity || velocity === 0) {
      this.velocities.push(velocity);
    }
  }

  getAverageStat(property) {
    return (
      this.members.reduce((acc, m) => acc + m[property], 0) /
      this.members.length
    );
  }

  getSumOfStat(property) {
    return this.members.reduce((acc, m) => acc + m[property], 0);
  }

  get skill() {
    return this.getAverageStat("skill");
  }

  get experience() {
    return this.getAverageStat("experience");
  }

  get happiness() {
    return this.getAverageStat("happiness");
  }

  get qualityMindset() {
    let qualityMindset = this.getAverageStat("qualityMindset");
    this.members
      .filter((member) => member instanceof Tester)
      .forEach((member) => {
        // for each tester add 10%
        qualityMindset = qualityMindset * 1.1;
      });
    return Math.min(qualityMindset, 1);
  }

  get collaboration() {
    return this.getAverageStat("collaboration");
  }

  get flow() {
    return this.getAverageStat("flow");
  }

  get estimation() {
    return this.getAverageStat("estimation");
  }

  get psychologicalSafety() {
    return this.getAverageStat("psychologicalSafety");
  }

  get dailyDev() {
    return this.members.map((member) => ({
      collaboration: Number.parseFloat(member.collaboration),
      effort: Number.parseFloat(member.dailyDevEffort),
      qualityMindset: Number.parseFloat(member.qualityMindset),
    }));
  }

  get size() {
    return this.members.length;
  }

  get velocity() {
    return this.velocities.length
      ? Math.round(average(this.velocities.slice(-3)))
      : undefined;
  }

  /**
   * Not a pure function
   */
  getCommitment() {
    const velocity = this.velocity || randomInt(10, 20);
    let commitment = velocity;

    // adjust +/- based on estimation
    const estimationShiftPercentageMax = (1 - this.estimation) * 100;
    const estimationShiftPercentage = randomInt(
      0,
      estimationShiftPercentageMax
    );
    const estimationShift = (velocity / 100) * estimationShiftPercentage;

    randomBoolean()
      ? (commitment += estimationShift)
      : (commitment -= estimationShift);

    // adjust + based on experience
    const MAX_YEARS_EXPERIENCE = 20;
    const experienceShiftPercentageMax =
      ((MAX_YEARS_EXPERIENCE - this.experience) / MAX_YEARS_EXPERIENCE) * 100;
    const experienceShiftPercentage = randomInt(
      0,
      experienceShiftPercentageMax
    );
    const experienceShift = (velocity / 100) * experienceShiftPercentage;
    commitment += experienceShift;

    return Math.round(commitment);
  }
}
