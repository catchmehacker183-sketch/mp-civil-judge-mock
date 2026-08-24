import { questions as constitutionQuestions } from "./questions/constitution";
import { questions as cpcQuestions } from "./questions/cpc";
import { questions as tpaQuestions } from "./questions/tpa";
import { questions as specificReliefQuestions } from "./questions/specificRelief";
import { questions as limitationQuestions } from "./questions/limitation";
import { questions as mpAccommodationQuestions } from "./questions/mpAccommodation";
import { questions as mpLandRevenueQuestions } from "./questions/mpLandRevenue";
import { questions as bsaQuestions } from "./questions/bsa";
import { questions as bnsQuestions } from "./questions/bns";
import { questions as bnssQuestions } from "./questions/bnss";
import { questions as niActQuestions } from "./questions/niAct";
import { questions as generalKnowledgeQuestions } from "./questions/generalKnowledge";
import { questions as computerQuestions } from "./questions/computer";
import { questions as englishQuestions } from "./questions/english";

export const questions = [
  constitutionQuestions,
  cpcQuestions,
  tpaQuestions,
  specificReliefQuestions,
  limitationQuestions,
  mpAccommodationQuestions,
  mpLandRevenueQuestions,
  bsaQuestions,
  bnsQuestions,
  bnssQuestions,
  niActQuestions,
  generalKnowledgeQuestions,
  computerQuestions,
  englishQuestions,
].flat();
