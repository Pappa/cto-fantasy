import { UserStory } from "./WorkItem";
import { workOnSprintBacklogItems } from "../utils/sprint";
import { sum } from "../utils/number";

export const SPRINT_LENGTH = 10;

export class Sprint {
  SPRINT_LENGTH = SPRINT_LENGTH;
  day = 0;
  constructor({ number, project, registry, emitter }) {
    this.number = number;
    this.project = project;
    this.team = this.project.team;
    this.customer = this.project.customer;
    this.registry = registry;
    this.emitter = emitter;
    this.commitment = this.team.getCommitment();

    this.createEvents();
  }

  getVelocity() {
    return sum(
      this.sprintBacklog
        .filter((item) => item instanceof UserStory && item.done())
        .map(({ estimate }) => estimate)
    );
  }

  getResults() {
    const velocity = this.getVelocity();
    return {
      commitment: this.commitment,
      velocity,
      success: Number.parseFloat((velocity / this.commitment).toFixed(2)),
      sprintBugs: this.sprintBugs,
      sprintBacklog: this.sprintBacklog,
    };
  }

  dayPassing(firefighting, workshop) {
    this.day++;
    const { backlog, bugs } = workOnSprintBacklogItems(
      this.sprintBacklog,
      this.sprintBugs,
      this.team,
      this.getDistractions(this.day, firefighting, workshop),
      this.project.backlog.storyPointValues
    );

    this.sprintBacklog = backlog;
    this.sprintBugs = bugs;
  }

  getDistractions(day, firefighting, workshop) {
    const numberOfDevs = this.team.dailyEffort.length;
    const retroActionDistractions = this.getRetroActionDistractions(
      numberOfDevs
    );
    const consultantDistractions = this.getConsultantDistractions(
      numberOfDevs,
      day
    );
    const firefightingDistractions = this.getFirefightingDistractions(
      numberOfDevs,
      firefighting
    );
    // TODO: there is an issue here.
    // The player is able to run workshops on the same day
    // that an Agile Coach is present
    const workshopDistractions = this.getWorkshopDistractions(
      numberOfDevs,
      workshop
    );
    const distractions = Array(numberOfDevs)
      .fill(0)
      .map(
        (x, idx) =>
          x +
          retroActionDistractions[idx] +
          consultantDistractions[idx] +
          firefightingDistractions[idx] +
          workshopDistractions[idx]
      );
    return distractions;
  }

  getRetroActionDistractions(numberOfDevs) {
    return Array(numberOfDevs)
      .fill(0)
      .map(
        () =>
          this.team.retrospectiveActions.length *
          this.project.settings.RETROSPECTIVE_ACTION_DAILY_EFFORT
      );
  }

  getConsultantDistractions(numberOfDevs, day) {
    const distractions = this.project.consultants
      .filter(({ contractTerm }) => day <= contractTerm)
      .reduce((acc, { impactOnDailyEffort }) => acc + impactOnDailyEffort, 0);
    return Array(numberOfDevs).fill(distractions);
  }

  getFirefightingDistractions(numberOfDevs, firefighting) {
    return Array(numberOfDevs)
      .fill(0)
      .map(() => (firefighting ? Math.random() : 0));
  }

  getWorkshopDistractions(numberOfDevs, workshop) {
    return Array(numberOfDevs).fill(!!workshop ? 0.3 : 0);
  }

  createEvents() {
    this.emitter.on("sprint_backlog_selected", (items) => {
      this.sprintBacklog = items;
      this.sprintBugs = [];
    });
  }

  end() {
    this.isComplete = true;
  }
}
