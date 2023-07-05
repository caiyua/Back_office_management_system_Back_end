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

 Date: 05/07/2023 18:29:32
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for punch_records
-- ----------------------------
DROP TABLE IF EXISTS `punch_records`;
CREATE TABLE `punch_records`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `date` datetime(0) NOT NULL,
  `punch_in` int(255) NOT NULL COMMENT '0代表未打卡，1代表已打卡',
  `reason` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '如果punch_in的值为reason，则此项可填值',
  PRIMARY KEY (`id`) USING BTREE,
  CONSTRAINT `punch_records_ibfk_1` FOREIGN KEY (`id`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of punch_records
-- ----------------------------
INSERT INTO `punch_records` VALUES (1, '2023-07-05 00:00:00', 0, NULL);

SET FOREIGN_KEY_CHECKS = 1;
