/*
 Navicat Premium Data Transfer

 Source Server         : 腾讯云
 Source Server Type    : MySQL
 Source Server Version : 50736
 Source Host           : 114.132.169.149:3306
 Source Schema         : test

 Target Server Type    : MySQL
 Target Server Version : 50736
 File Encoding         : 65001

 Date: 10/07/2023 18:22:28
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for punch_records
-- ----------------------------
DROP TABLE IF EXISTS `punch_records`;
CREATE TABLE `punch_records`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NULL DEFAULT NULL COMMENT '对应user表中的id',
  `date` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),
  `punch_in` int(255) NOT NULL COMMENT '0代表未打卡，1代表已打卡',
  `reason` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '如果punch_in的值为reason，则此项可填值',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `fk_punch_records_user`(`user_id`) USING BTREE,
  CONSTRAINT `fk_punch_records_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 22 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of punch_records
-- ----------------------------
INSERT INTO `punch_records` VALUES (10, 1, '2023-07-06 10:09:25', 0, '@#$&@#(*$&*#!');
INSERT INTO `punch_records` VALUES (11, 1, '2023-07-06 10:13:10', 0, '@#$&@#(*$&*#!');
INSERT INTO `punch_records` VALUES (12, 1, '2023-07-06 10:19:39', 0, NULL);
INSERT INTO `punch_records` VALUES (13, 1, '2023-07-06 10:19:39', 0, NULL);
INSERT INTO `punch_records` VALUES (14, 1, '2023-07-06 10:23:19', 1, NULL);
INSERT INTO `punch_records` VALUES (15, 1, '2023-07-06 10:23:19', 1, NULL);
INSERT INTO `punch_records` VALUES (16, 1, '2023-07-06 10:24:56', 1, NULL);
INSERT INTO `punch_records` VALUES (17, 1, '2023-07-06 10:28:13', 1, NULL);
INSERT INTO `punch_records` VALUES (18, 1, '2023-07-06 10:34:26', 0, '今天早上，我突然感到身体不适，出现了剧烈的头痛和恶心的症状。由于状况突然，我没有足够时间处理这个问题并按时打卡。家庭紧急情况：我在上班前接到了家里的紧急电话，其中涉及到家人的健康问题。我不得不立即离开家处理这个紧急情况，导致没有打卡。交通意外：在通勤途中，我遇到了严重的交通堵塞和意外事件，这导致我无法按时到达公司并打卡。我对我的疏忽表示深深的歉意，并明白这是一种不负责任的行为。我明白打卡是记录出勤和工作时间的重要手段，并且我会采取措施来避免类似情况再次发生。我理解公司对员工的准时到岗有合理的期望，我愿意承担由此带来的后果。再次对我的疏忽表示歉意，并希望能得到您的谅解。如果需要进一步的讨论或提供任何补充材料，请随时告知。谢谢您的理解和支持。');
INSERT INTO `punch_records` VALUES (19, 1, '2023-07-10 14:48:09', 1, NULL);
INSERT INTO `punch_records` VALUES (20, 1, '2023-07-10 14:48:12', 0, '');
INSERT INTO `punch_records` VALUES (21, 1, '2023-07-10 14:48:27', 0, '');

SET FOREIGN_KEY_CHECKS = 1;
