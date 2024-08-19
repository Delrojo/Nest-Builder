import React from "react";
import {
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import withAuth from "@/components/Modal/Auth/withAuth";
import GraylistUsers from "@/components/Admin/GraylistUsers";
import ComponentStylesGrid from "@/components/Admin/ComponentStylesGrid";
import TodoList from "@/components/Admin/TodoList";

type AdminDashboardProps = {};

const AdminDashboard: React.FC<AdminDashboardProps> = () => {
  return (
    <Flex direction="column" height="100%">
      <Tabs variant="enclosed">
        <TabList>
          <Tab>Graylist Management</Tab>
          <Tab>Component Styles</Tab>
          <Tab>To-Do List</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <GraylistUsers />
          </TabPanel>
          <TabPanel>
            <ComponentStylesGrid />
          </TabPanel>
          <TabPanel>
            <TodoList />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

export default withAuth(AdminDashboard);
